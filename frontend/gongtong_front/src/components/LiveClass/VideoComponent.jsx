import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import useVideoStore from "./../../store/useVideoStore";
import StreamComponent from "./StreamComponent";
import ToolbarComponent from "./ToolbarComponent";

import UserModel from "./UserModel";

//<

const APPLICATION_SERVER_URL = "http://localhost:5000/";
const localUserSetting = new UserModel();

const VideoComponent = () => {
  const location = useLocation();

  const OV = useVideoStore((state) => state.OV);
  const setOV = useVideoStore((state) => state.setOV);
  const selectedAudioDevice = useVideoStore(
    (state) => state.selectedAudioDevice
  );
  const selectedVideoDevice = useVideoStore(
    (state) => state.selectedVideoDevice
  );

  const { audioActive, videoActive } = location.state;
  const [localUser, setLocalUser] = useState(null);

  const [session, setSession] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const remotes = useRef([]);
  const localUserAccessAllowed = useRef(false); // 카메라, 마이크 접근 권한?

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      leaveSession();
    };
  }, []);

  const [mySessionId, setMySessionId] = useState("SessionA");
  const [myUserName, setMyUserName] = useState(
    "OpenVidu_User" + Math.floor(Math.random() * 100)
  );

  const joinSession = async () => {
    const newSession = OV.initSession();
    setSession(newSession);
    await connectToSession(newSession);
    subscribeToStreamCreated(newSession);
    // subscribeToStreamDestroyed(newSession);
    // subscribeToUserChanged(newSession);
    console.log(newSession);
  };

  const connectToSession = async (session) => {
    try {
      const token = await getToken();
      connect(session, token);
    } catch (error) {
      console.error(
        "토큰을 가져오는데 문제가 있음 :",
        error.code,
        error.message
      );
      alert("토큰을 가져오는데 문제가 있어용 :", error.message);
    }
  };

  const connect = (session, token) => {
    session
      .connect(token, { clientData: myUserName })
      .then(() => {
        connectWebCam(session);
      })
      .catch((error) => {
        alert("세션에 연결하는데 문제가 있음 : ", error.message);
        console.log(
          "세션에 연결하는데 문제가 있어용 :",
          error.code,
          error.message
        );
      });
  };

  const nicknameChanged = (nickname) => {
    localUser.setNickname(nickname);
    setLocalUser(localUser);
    sendSignalUserChanged(session, { nickname: localUser.getNickname() });
  };

  const connectWebCam = async (session) => {
    const publisher = OV.initPublisher(undefined, {
      audioSource: selectedAudioDevice,
      videoDevice: selectedVideoDevice,
      publishAudio: audioActive,
      publishVideo: videoActive,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });
    if (session.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        session.publish(publisher).then(() => {
          updateSubscribers();
          localUserAccessAllowed.current = true;
        });
      });
    }

    localUserSetting.setNickname("myNickName");
    localUserSetting.setConnectionId(session.connection.connectionId);
    localUserSetting.setScreenShareActive(false);
    localUserSetting.setStreamManager(publisher);
    setLocalUser(localUserSetting);
    subscribeToUserChanged(session);
    subscribeToStreamDestroyed(session);
  };

  const subscribeToUserChanged = (session) => {
    console.log("유저에게 변경사항이 있음");
    session.on("signal:userChanged", (event) => {
      const data = JSON.parse(event.data);
      const updatedSubscribers = subscribers.map((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          if (data.isAudioActive !== undefined)
            user.setAudioActive(data.isAudioActive);
          if (data.isVideoActive !== undefined)
            user.setVideoActive(data.isVideoActive);
          if (data.nickname !== undefined) user.setNickname(data.nickname);
        }
        return user;
      });
      setSubscribers(updatedSubscribers);
    });
  };

  const subscribeToStreamDestroyed = (session) => {
    session.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream);
    });
  };

  const deleteSubscriber = (stream) => {
    console.log(remotes.current);
    const userStream = remotes.current.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    const index = remotes.current.indexOf(userStream, 0);
    if (index > -1) {
      remotes.current.splice(index, 1);
      setSubscribers([...remotes.current]);
    }
  };

  const subscribeToStreamCreated = (session) => {
    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      const nickname = event.stream.connection.data.split("%")[0];
      const remoteUser = new UserModel();
      remoteUser.setConnectionId(event.stream.connection.connectionId);
      remoteUser.setAudioActive(true);
      remoteUser.setVideoActive(true);
      remoteUser.setNickname(JSON.parse(nickname).clientData);
      remoteUser.setStreamManager(subscriber);
      remoteUser.setType("remote");
      remotes.current.push(remoteUser);
      if (localUserAccessAllowed.current) {
        updateSubscribers(session);
      }
    });
  };

  const updateSubscribers = (session) => {
    setSubscribers([...remotes.current]);
    if (localUser) {
      sendSignalUserChanged(session, {
        isAudioActive: localUser.audioActive,
        isVideoActive: localUser.videoActive,
        nickname: localUser.nickname,
        isScreenShareActive: localUser.screenShareActive,
      });
    }
    console.log(document.getElementsByTagName("StreamComponent").length);
  };

  const sendSignalUserChanged = (session, data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    if (session) {
      session.signal(signalOptions);
    } else {
      console.error("세션이 없어용");
    }
  };

  const onbeforeunload = (event) => {
    leaveSession();
    event.preventDefault();
    event.returnValue = "";
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setOV(null);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("SessionA");
    setLocalUser(undefined);
    remotes.current.length = 0;
  };

  const getToken = useCallback(async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  }, []);

  const createSession = useCallback(async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }, []);

  const createToken = useCallback(async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  }, []);

  const videolistcss = {
    display: "flex",
    flexWrap: "wrap",
  };

  const localcss = {
    height: "50%",
  };

  const toolcss = {
    float: "bottom",
  };

  return (
    <>
      <h1>라이브클래스</h1>
      <div id="layout" className="bounds" style={videolistcss}>
        {localUser && localUser.getStreamManager() && (
          <div id="localUser" style={localcss}>
            <h4>localUser의 스트림</h4>
            <StreamComponent user={localUser} />
          </div>
        )}
        <div style={videolistcss}>
          {subscribers.map((sub, i) => (
            <div
              key={i}
              className="OT_root OT_publisher custom-class"
              id="remoteUsers"
            >
              <h4>remoteUser의 스트림</h4>
              <StreamComponent user={sub} />
            </div>
          ))}
        </div>
      </div>
      <ToolbarComponent leaveSession={leaveSession} style={toolcss} />
    </>
  );
};

export default VideoComponent;

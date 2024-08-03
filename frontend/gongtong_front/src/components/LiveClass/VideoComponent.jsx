import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import useVideoStore from "./../../store/useVideoStore";
import StreamComponent from "./StreamComponent";
import ToolbarComponent from "./ToolbarComponent";
import UserModel from "./UserModel";

import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { Client } from "@stomp/stompjs";

const APPLICATION_SERVER_URL = "http://localhost:8080/api/v1/";
const localUserSetting = new UserModel();

//채팅 관련
// const CHAT_SERVER_URL = "ws://192.168.31.83:8081/chat"; // 교육장
const CHAT_SERVER_URL = "ws://localhost:8081/chat"; //집
const roomId = "66a9c5dd498fe728acb763f8";
const userId = 1;
const userLang = "Japanese";
const CHUNK_SIZE = 16000;

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
  const localUserAccessAllowed = useRef(false);

  const sessionId = useVideoStore((state) => state.sessionId);
  const setSessionId = useVideoStore((state) => state.setSessionId);

  //미디어 파이프 및 영상 녹화 관련
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const isRecording = useRef(false);
  const raiseTimeout = useRef(null);
  const lowerTimeout = useRef(null);
  const hands = useRef(null);
  const camera = useRef(null);
  const audioStream = useRef(null);

  //채팅 관련
  const stompClient = useRef(null);

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();
    initializeMediapipe();

    stompClient.current = new Client({
      brokerURL: CHAT_SERVER_URL,
      debug: (str) => {
        console.log(str);
      },
      onConnect: async (frame) => {
        console.log("Connected: " + frame);
      },
      onWebSocketError: (error) => {
        console.error("Error with websocket", error);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    connectStompClient();

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
    console.log(newSession);
  };

  const connectToSession = async (session) => {
    try {
      const token = await getToken();
      console.log("토큰토큰토큰토큰토큰토큰토큰토큰토큰토큰", token);
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
    // const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  }, []);

  // const createSession = useCallback(async (sessionId) => {
  //   const response = await axios.post(
  //     APPLICATION_SERVER_URL + "api/sessions",
  //     { customSessionId: sessionId },
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  //   return response.data;
  // }, []);

  const createToken = useCallback(async (sessionId) => {
    console.log(sessionId);
    const response = await axios.post(
      "http://localhost:8080/api/v1/classes/live/sessions/" +
        sessionId +
        "/connections",
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    console.log(response.data);
    return response.data.data;
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

  //미디어파이프 관련
  const initializeMediapipe = () => {
    const videoElement = document.querySelector(".input_video");

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
        audioStream.current = stream;
      })
      .catch((error) => {
        console.error("Error accessing the camera: ", error);
      });

    hands.current = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.current.onResults(onResults);

    camera.current = new Camera(videoElement, {
      onFrame: async () => {
        await hands.current.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });

    camera.current.start();
  };

  const onResults = (results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        const wrist = landmarks[0]; // 손목 위치
        const indexFingerTip = landmarks[8]; // 검지 손가락 끝 위치
        const middleFingerTip = landmarks[12]; // 중지 손가락 끝 위치

        // 손목보다 손가락 끝이 높으면 손을 든 것으로 간주 (y값이 작을수록 더 높음)
        if (
          indexFingerTip.y < wrist.y &&
          middleFingerTip.y < wrist.y &&
          isHandOpen(landmarks)
        ) {
          console.log("손을 들었음");
          if (!isRecording.current && !raiseTimeout.current) {
            // 손이 올라갔을 때 타이머
            console.log("2초 동안 손 들고 있으면, 이후 녹화 시작");
            raiseTimeout.current = setTimeout(() => {
              startRecording();
              raiseTimeout.current = null;
            }, 2000);
          }
          if (lowerTimeout.current) {
            // 손이 내려갔을 때 타이머 초기화
            clearTimeout(lowerTimeout.current);
            lowerTimeout.current = null;
          }
        } else {
          if (raiseTimeout.current) {
            // 손이 2초 동안 들리지 않으면 타이머 취소
            console.log("녹화 취소");
            clearTimeout(raiseTimeout.current);
            raiseTimeout.current = null;
          }
        }
      }
    } else {
      if (isRecording.current) {
        if (!lowerTimeout.current) {
          console.log("2초 동안 손 내리고 있으면, 이후 녹화 종료");
          lowerTimeout.current = setTimeout(() => {
            stopRecording();
            lowerTimeout.current = null;
          }, 2000);
        }
      } else {
        if (raiseTimeout.current) {
          clearTimeout(raiseTimeout.current);
          raiseTimeout.current = null;
        }
      }
    }
  };

  const isHandOpen = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexFingerTip = landmarks[8];
    const pinkyTip = landmarks[20];

    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumbTip.x - indexFingerTip.x, 2) +
        Math.pow(thumbTip.y - indexFingerTip.y, 2) +
        Math.pow(thumbTip.z - indexFingerTip.z, 2)
    );

    const thumbPinkyDistance = Math.sqrt(
      Math.pow(thumbTip.x - pinkyTip.x, 2) +
        Math.pow(thumbTip.y - pinkyTip.y, 2) +
        Math.pow(thumbTip.z - pinkyTip.z, 2)
    );

    return thumbIndexDistance > 0.1 && thumbPinkyDistance > 0.1;
  };

  const startRecording = () => {
    isRecording.current = true;
    if (!audioStream.current) {
      console.error("Audio stream is not available.");
      return;
    }
    mediaRecorder.current = new MediaRecorder(audioStream.current);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      console.log("음성 파일 서버에 전송");
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      // saveAudioFile(audioBlob);
      sendRecordingToServer(audioBlob);
    };

    mediaRecorder.current.start();
    console.log("Recording started");
  };

  //서버로 오디오 보내기
  const sendRecordingToServer = (audioBlob) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      const totalChunks = Math.ceil(base64Data.length / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const chunk = base64Data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const chatMessage = {
          userId: parseInt(userId),
          fileContent: chunk,
          chunkIndex: i,
          totalChunks: totalChunks,
        };

        console.log(`Sending chunk ${i + 1} of ${totalChunks}`);
        stompClient.current.publish({
          destination: `/pub/chat/voice/rooms/${roomId}`,
          body: JSON.stringify(chatMessage),
        });
      }
    };

    reader.readAsDataURL(audioBlob);
  };

  const stopRecording = () => {
    isRecording.current = false;
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      console.log("Recording stopped");
    }
  };

  //프론트에서 저장해보고 싶으면 사용(실제로는 필요 x)
  const saveAudioFile = (audioBlob) => {
    const url = window.URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.wav";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  //채팅
  const connectStompClient = () => {
    stompClient.current.activate();
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
      <video className="input_video" style={{ display: "none" }}></video>
    </>
  );
};

export default VideoComponent;

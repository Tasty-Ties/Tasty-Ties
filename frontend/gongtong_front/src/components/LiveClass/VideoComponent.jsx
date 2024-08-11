const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER;
const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER;

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import useVideoStore from "./../../store/useVideoStore";
import StreamComponent from "./StreamComponent";
import ToolbarComponent from "./ToolbarComponent";
import UserModel from "./UserModel";

import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

import { Client } from "@stomp/stompjs";
import MediaDeviceSetting from "./MediaDeviceSetting";
import useMyPageStore from "../../store/MyPageStore";
import ChatComponent from "./ChatComponent";
import PeopleListComponent from "./PeopleListComponent";

import "./../../styles/LiveClass/LiveClass.css";
import ChatLog from "../ChatRoom/ChatLog";
import AttendeeList from "../ChatRoom/AttendeeList";
import CameraCapture from "./CameraCapture";

const localUserSetting = new UserModel();

//채팅 관련
const roomId = "66a9c5dd498fe728acb763f8";
const userId = 1;
const userLang = "Japanese";
const CHUNK_SIZE = 16000;

const VideoComponent = ({ isHost }) => {
  const OV = useVideoStore((state) => state.OV);
  const setOV = useVideoStore((state) => state.setOV);
  const selectedAudioDevice = useVideoStore(
    (state) => state.selectedAudioDevice
  );
  const selectedVideoDevice = useVideoStore(
    (state) => state.selectedVideoDevice
  );
  const isVideoActive = useVideoStore((state) => state.isVideoActive);
  const isAudioActive = useVideoStore((state) => state.isAudioActive);

  const userInfo = useMyPageStore((state) => state.informations);
  const classData = useVideoStore((state) => state.classData);
  console.log(classData);

  const [localUser, setLocalUser] = useState(null);
  const session = useRef(null);
  const [subscribers, setSubscribers] = useState([]);

  const [hostUser, setHostUser] = useState(null);
  const [partUser, setPartUser] = useState();
  const [userProfileList, setUserProfileList] = useState({});

  const videoRef = useRef(null);

  const remotes = useRef([]);
  const localUserAccessAllowed = useRef(false);

  const sessionId = useVideoStore((state) => state.sessionId);
  const currentPublisher = useRef();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHostOnly, setIsHostOnly] = useState(true);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isPeopleListOpen, setIsPeopleListOpen] = useState(false);
  const [isSliderOn, setIsSliderOn] = useState(false);
  const [displayMode, setDisplayMode] = useState(0);

  // 비디오 레이아웃 순서 정렬하는 코드
  useEffect(() => {
    console.log(subscribers);
    if (!subscribers) {
      return;
    }
    setHostUser(null);
    setPartUser([]);
    if (isHost) {
      setHostUser(localUser);
      setPartUser(subscribers);
    } else {
      setPartUser((prev) =>
        prev && prev.length > 0 ? [...prev, localUser] : [localUser]
      );
      subscribers.map((data) => {
        if (data.nickname === classData.hostProfile.nickname) {
          setHostUser(data);
        } else {
          setPartUser((prev) => [...prev, data]);
        }
      });
    }
  }, [subscribers, localUser?.streamManager]);

  // 참여자 목록 정리하는 코드
  useEffect(() => {
    console.log(partUser);
    console.log(userInfo);
    if (!classData || !localUser) return;
    const host = classData.hostProfile;
    const parts = classData.userProfiles;
    setUserProfileList({
      [host.username]: [
        host.nickname,
        host.profileImageUrl,
        "HOST",
        host.username,
      ],
    });
    if (parts) {
      parts.forEach((part) => {
        setUserProfileList((prev) => ({
          ...prev,
          [part.username]: [
            part.nickname,
            part.profileImageUrl,
            "ATTENDEE",
            part.username,
          ],
        }));
      });
    }
  }, [partUser, localUser]);

  //미디어 파이프 및 영상 녹화 관련
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const isRecording = useRef(false);
  const raiseTimeout = useRef(null);
  const lowerTimeout = useRef(null);
  const audioStream = useRef(null);

  //채팅 관련
  const stompClient = useRef(null);

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    console.log(userInfo.length);

    joinSession();
    // initializeMediapipe();
    initializeGestureRecognizer();

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

      connectHeaders: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    connectStompClient();

    const host = classData.hostProfile;
    setUserProfileList({
      [host.username]: [
        host.nickname,
        host.profileImageUrl,
        "HOST",
        host.username,
      ],
    });

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      leaveSession();
    };
  }, []);

  useEffect(() => {
    switchCamera();
  }, [selectedVideoDevice]);
  useEffect(() => {
    switchMic();
  }, [selectedAudioDevice]);

  const joinSession = async () => {
    const newSession = OV.initSession();
    session.current = newSession;
    await connectToSession(newSession);
    subscribeToStreamCreated(newSession);
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
      .connect(token, { clientData: userInfo.nickname })
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

  const connectWebCam = async (session) => {
    try {
      console.log(selectedVideoDevice.deviceId);
      const publisher = OV.initPublisher(undefined, {
        audioSource: selectedAudioDevice?.deviceId, // 오디오 트랙을 사용합니다.
        videoSource: selectedVideoDevice.deviceId,
        publishAudio: isAudioActive,
        publishVideo: isVideoActive,
        resolution: "1280x720",
        frameRate: 30,
        insertMode: "APPEND",
      });

      currentPublisher.current = publisher;
      audioStream.current = publisher.stream.mediaStream; // 오디오 스트림을 저장합니다.

      if (session.capabilities.publish) {
        publisher.on("accessAllowed", () => {
          session.publish(publisher).then(() => {
            updateSubscribers();
            localUserAccessAllowed.current = true;
          });
        });
      }

      localUserSetting.setNickname(userInfo.nickname);
      localUserSetting.setConnectionId(session.connection.connectionId);
      localUserSetting.setScreenShareActive(false);
      localUserSetting.setStreamManager(publisher);
      setLocalUser(localUserSetting);
      subscribeToUserChanged(session);
      subscribeToStreamDestroyed(session);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("오디오 또는 비디오 장치에 접근할 수 없습니다: " + error.message);
    }
  };

  const switchCamera = async () => {
    if (currentPublisher.current) {
      const newPublisher = await OV.initPublisher(undefined, {
        audioSource: selectedAudioDevice?.deviceId,
        videoSource: selectedVideoDevice.deviceId,
        publishAudio: isAudioActive,
        publishVideo: isVideoActive,
        resolution: "1280x720",
        frameRate: 30,
        insertMode: "APPEND",
      });

      await new Promise((resolve, reject) => {
        newPublisher.once("accessAllowed", resolve);
        newPublisher.once("accessDenied", reject);
      });

      currentPublisher.current.replaceTrack(
        newPublisher.stream.mediaStream.getVideoTracks()[0]
      );
      audioStream.current = newPublisher.stream.mediaStream;

      localUserSetting.setStreamManager({ ...newPublisher });
      setLocalUser(localUserSetting);
    }
  };
  const switchMic = async () => {
    if (currentPublisher.current) {
      const newPublisher = await OV.initPublisher(undefined, {
        audioSource: selectedAudioDevice?.deviceId,
        videoSource: selectedVideoDevice.deviceId,
        publishAudio: isAudioActive,
        publishVideo: isVideoActive,
        resolution: "1280x720",
        frameRate: 30,
        insertMode: "APPEND",
      });

      await new Promise((resolve, reject) => {
        newPublisher.once("accessAllowed", resolve);
        newPublisher.once("accessDenied", reject);
      });

      currentPublisher.current.replaceTrack(
        newPublisher.stream.mediaStream.getAudioTracks()[0]
      );
      audioStream.current = newPublisher.stream.mediaStream;

      localUserSetting.setStreamManager({ ...newPublisher });
      setLocalUser(localUserSetting);
    }
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
    if (session.current) {
      session.current.disconnect();
    }
    setOV(null);
    session.current = null;
    setSubscribers([]);
    setLocalUser(undefined);
    remotes.current.length = 0;
  };

  const getToken = useCallback(async () => {
    return await createToken(sessionId);
  }, []);

  const createToken = useCallback(async (sessionId) => {
    console.log(sessionId);
    const response = await axios.post(
      MAIN_SERVER_URL + "/classes/live/sessions/" + sessionId + "/connections",
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

  //GestureRecognizer
  const initializeGestureRecognizer = async () => {
    const videoElement = videoRef.current;
    videoElement.style.display = "block"; // 비디오를 화면에 표시
    videoElement.style.position = "absolute"; //화면 밖으로
    videoElement.style.top = "-9999px";
    videoElement.style.left = "-9999px";

    // 카메라 스트림을 가져와서 비디오 엘리먼트에 연결
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((error) => {
        console.error("카메라 접근 오류:", error);
      });

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const gestureRecognizer = await GestureRecognizer.createFromModelPath(
        vision,
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
      );

      if (!gestureRecognizer) {
        console.error("Gesture Recognizer 초기화 실패");
        return;
      }

      // Running mode를 video로 설정
      await gestureRecognizer.setOptions({ runningMode: "video" });

      // console.log("Gesture Recognizer 초기화 성공");
      console.log("videoElement.readyState " + videoElement.readyState);
      console.log("외안되?");

      if (videoElement) {
        console.log("비디오 엘리먼트 존재 확인:", videoElement);

        //loadedmetadata, loadeddata
        // videoElement.addEventListener("canplay", () => {
        //   console.log("렌더 루프 시작");
        //   renderLoop(videoElement, gestureRecognizer);
        // });

        if (videoElement.readyState >= 4) {
          console.log("렌더 루프 시작");
          renderLoop(videoElement, gestureRecognizer);
        }
      } else {
        console.error("비디오 엘리먼트를 찾을 수 없음");
      }
    } catch (error) {
      console.error("Gesture Recognizer 초기화 중 오류 발생:", error);
    }
  };

  let lastVideoTime = -1;

  const renderLoop = (videoElement, gestureRecognizer) => {
    // 현재 비디오 타임스탬프를 확인하여 이미 처리된 프레임인지 확인
    if (videoElement.currentTime !== lastVideoTime) {
      const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(
        videoElement,
        Date.now()
      );

      // 결과를 처리하는 함수 호출
      // processResult(gestureRecognitionResult);
      processVideoFrame(videoElement, gestureRecognizer);

      // 타임스탬프 업데이트
      lastVideoTime = videoElement.currentTime;
    }

    // 다음 프레임을 처리하도록 루프를 계속 실행
    requestAnimationFrame(() => {
      renderLoop(videoElement, gestureRecognizer);
    });
  };

  const processVideoFrame = async (videoElement, gestureRecognizer) => {
    const results = await gestureRecognizer.recognizeForVideo(
      videoElement,
      Date.now()
    );

    onGestureResults(results);
    requestAnimationFrame(() => {
      processVideoFrame(videoElement, gestureRecognizer);
    });
  };

  const onGestureResults = (results) => {
    if (results.gestures && results.gestures.length > 0) {
      const gesture = results.gestures[0][0].categoryName; // 가장 높은 확률의 제스처

      if (gesture === "Open_Palm") {
        console.log("손을 들었음");
        if (!isRecording.current && !raiseTimeout.current) {
          console.log("1초 동안 손 들고 있으면, 이후 녹화 시작");
          raiseTimeout.current = setTimeout(() => {
            startRecording();
            raiseTimeout.current = null;
          }, 1000);
        }
        if (lowerTimeout.current) {
          clearTimeout(lowerTimeout.current);
          lowerTimeout.current = null;
        }
      } else {
        // 손을 내린 상태 인식 (주먹을 쥔 제스처로 가정)
        if (raiseTimeout.current) {
          console.log("녹화 취소");
          clearTimeout(raiseTimeout.current);
          raiseTimeout.current = null;
        }
      }
    } else {
      if (isRecording.current) {
        if (!lowerTimeout.current) {
          console.log("1초 동안 손 내리고 있으면, 이후 녹화 종료");
          lowerTimeout.current = setTimeout(() => {
            stopRecording();
            lowerTimeout.current = null;
          }, 1000);
        }
      } else {
        if (raiseTimeout.current) {
          clearTimeout(raiseTimeout.current);
          raiseTimeout.current = null;
        }
      }
    }
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
    console.log("녹화 중지 함수 들어옴");
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

  const displaySetting = (modeNumber) => {
    switch (modeNumber) {
      case 0: // HostOnly
        setIsSliderOn(false);
        setIsHostOnly(true);
        return "w-2/3 mx-8";
      case 1: // Spread
        setIsHostOnly(false);
        if (isChatOpen || isPeopleListOpen) {
          return "w-2/3 grid grid-cols-2 gap-1 mx-36";
        } else {
          return "w-full grid grid-cols-3 gap-1 mx-36";
        }
      case 2: // SliderOn
        setIsSliderOn(true);
        if (isChatOpen || isPeopleListOpen) {
          return "w-2/3 grid grid-cols-4 gap-1 mx-24";
        } else {
          return "w-2/3 grid grid-cols-4 gap-1 mx-36";
        }
    }
  };

  useEffect(() => {
    return () => {
      if (raiseTimeout.current) {
        clearTimeout(raiseTimeout.current);
      }
      if (lowerTimeout.current) {
        clearTimeout(lowerTimeout.current);
      }
    };
  }, []);

  // 비디오 레이이아웃
  const displayChange = () => {
    const newMode = (displayMode + 1) % 3;
    console.log(newMode);
    setDisplayMode(newMode);
    setVideoClassName(displaySetting(newMode));
    console.log(displaySetting(newMode));
  };

  const captureOpen = () => {
    if (localUser) {
      setIsCaptureOpen(!isCaptureOpen);
    }
  };

  const peopleListOpen = () => {
    if (isChatOpen) {
      chatOpen();
    }
    setIsPeopleListOpen(!isPeopleListOpen);
  };

  const chatOpen = () => {
    if (isPeopleListOpen) {
      peopleListOpen();
    }
    setIsChatOpen(!isChatOpen);
  };

  const ref = useRef(null);

  const prevButton = () => {
    if (ref.current) ref.current.scrollLeft -= 200;
  };
  const nextButton = () => {
    if (ref.current) ref.current.scrollLeft += 200;
  };

  const [videoClassName, setVideoClassName] = useState("w-2/3 mx-8");

  return (
    <>
      <CameraCapture
        isCaptureOpen={isCaptureOpen}
        captureOpen={captureOpen}
        localUser={localUser}
      />
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
        <div className="h-20 w-full flex justify-center items-center">
          <div className="text-2xl">{classData.title}</div>
        </div>
        <div className="h-2/3 w-full items-center justify-center flex-auto flex flex-row">
          {isSliderOn ? (
            <div id="layout" className={videoClassName}>
              {hostUser && hostUser.getStreamManager() && (
                <div
                  id="hostUser"
                  className="aspect-video col-start-1 col-end-5 row-start-1 row-end-2 mx-32"
                >
                  <StreamComponent user={hostUser} />
                </div>
              )}
              <div className="flex flex-row w-full col-start-1 col-end-5">
                <button onClick={prevButton} className="">
                  &lt;
                </button>
                <div
                  ref={ref}
                  className="flex min-h-32 flex-row overflow-x-scroll flex-auto"
                  id="scroll"
                >
                  {partUser &&
                    partUser.map((sub, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-1/4 aspect-video object-fill p-1"
                      >
                        <StreamComponent user={sub} className="" />
                      </div>
                    ))}
                </div>
                <button onClick={nextButton} className="">
                  &gt;
                </button>
              </div>
            </div>
          ) : (
            <div id="layout" className={videoClassName}>
              {hostUser && hostUser.getStreamManager() && (
                <div id="hostUser">
                  <StreamComponent user={hostUser} />
                </div>
              )}
              {!isHostOnly &&
                partUser &&
                partUser.map((sub, i) => (
                  <div key={i} id="partUser">
                    <StreamComponent user={sub} />
                  </div>
                ))}
            </div>
          )}
          {isChatOpen && (
            <div className="w-1/3 mx-3 my-3 border-solid border-2">
              <ChatLog
                userProfile={userInfo.profileImageUrl}
                chatRoomId={classData.chatRoomId}
                chatRoomTitle={"채팅방"}
                stompClient={stompClient}
                username={userInfo.username}
                nickname={userInfo.nickname}
                userLang={userInfo.language.englishName}
              />
            </div>
          )}
          {isPeopleListOpen && (
            <div className="w-1/3 self-stretch mx-3 my-3 border-solid border-2">
              <AttendeeList
                setOpen={setIsPeopleListOpen}
                nickname={userInfo.nickname}
                users={userProfileList}
                subscribers={subscribers}
              />
            </div>
          )}
        </div>

        <div className="h-20 flex">
          <MediaDeviceSetting currentPublisher={currentPublisher} />
          <ToolbarComponent
            displayMode={displayChange}
            captureOpen={captureOpen}
            peopleListOpen={peopleListOpen}
            chatOpen={chatOpen}
            leaveSession={leaveSession}
          />
        </div>
      </div>
      <video
        ref={videoRef}
        className="input_video"
        style={{ display: "none" }}
      ></video>
    </>
  );
};

export default VideoComponent;

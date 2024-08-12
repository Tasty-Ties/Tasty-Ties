const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER;
const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER;

import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";

import useVideoStore from "./../../store/useVideoStore";
import StreamComponent from "./StreamComponent";
import ToolbarComponent from "./ToolbarComponent";
import UserModel from "./UserModel";

import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

import { Client } from "@stomp/stompjs";
import useMyPageStore from "../../store/MyPageStore";
import MediaDeviceSetting from "./MediaDeviceSetting";

import AttendeeList from "../ChatRoom/AttendeeList";
import ChatLog from "../ChatRoom/ChatLog";
import "./../../styles/LiveClass/LiveClass.css";
import CameraCapture from "./CameraCapture";
import ExitLiveClass from "./ExitLiveClass";
import { useNavigate } from "react-router-dom";

const localUserSetting = new UserModel();

const VideoComponent = ({ isHost }) => {
  const nav = useNavigate();

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
  const canvasRef = useRef(null);

  const remotes = useRef([]);
  const localUserAccessAllowed = useRef(false);

  const sessionId = useVideoStore((state) => state.sessionId);
  const currentPublisher = useRef();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isHostOnly, setIsHostOnly] = useState(true);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isPeopleListOpen, setIsPeopleListOpen] = useState(false);
  const [isSliderOn, setIsSliderOn] = useState(false);
  const [displayMode, setDisplayMode] = useState(0);

  const [isForcedExit, setIsForcedExit] = useState();

  // 비디오 레이아웃 순서 정렬하는 코드
  useEffect(() => {
    // console.log(subscribers);
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

  //채팅 관련
  const stompClient = useRef(null);

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);

    joinSession();

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

  //미디어 파이프 및 영상 녹화 관련
  const raiseTimeout = useRef(null);
  const lowerTimeout = useRef(null);
  const audioStream = useRef(null);

  useEffect(() => {
    initializeGestureRecognizer(); // 제스처 초기화
    if (userInfo && userInfo.language && userInfo.language.languageCode) {
      const languageCode = userInfo.language.languageCode.toLowerCase(); // 언어 코드를 소문자로 변환
      const countryCode = userInfo.country.countryCode.toUpperCase();
      initializeSpeechRecognition(languageCode, countryCode); // 음성 인식 초기화
    }
  }, []);

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
      // 오디오와 비디오 스트림을 함께 가져옵니다.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { deviceId: selectedVideoDevice.deviceId },
      });

      // 퍼블리셔를 초기화합니다.
      const publisher = OV.initPublisher(undefined, {
        audioSource: selectedAudioDevice?.deviceId, // 오디오 소스를 설정
        videoSource: selectedVideoDevice.deviceId,
        publishAudio: isAudioActive,
        publishVideo: isVideoActive,
        resolution: "1280x720",
        frameRate: 30,
        insertMode: "APPEND",
      });

      currentPublisher.current = publisher;
      audioStream.current = stream; // 오디오 스트림을 제대로 설정합니다.

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
    session.on("signal:host-left", (event) => {
      setIsForcedExit(true);
      exitOpen();
    });
  };

  const subscribeToStreamDestroyed = (session) => {
    session.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream);
      const connection = event.stream.connection;
      console.log(hostUser);
      if (connection.data.split(`"`)[3] === classData.hostProfile.nickname) {
        session.signal({
          type: "host-left",
        });
      }
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
    // console.log(sessionId);
    const response = await axios.post(
      MAIN_SERVER_URL + "/classes/live/sessions/" + sessionId + "/connections",
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    // console.log(response.data);
    return response.data.data;
  }, []);

  //Web Speech API 관련
  let recognition = null;
  let isRecognitionActive = false; // 음성 인식 상태를 추적

  const initializeSpeechRecognition = (languageCode, countryCode) => {
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = languageCode + "-" + countryCode || "ko-KR"; // 사용자의 언어로 지정하되, 한국어가 기본
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // recognition.continuous = true; // 연속 인식 모드로 설정

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      console.log("최종 결과:", finalTranscript);
      sendMessage(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      isRecognitionActive = false;
      //TODO: 여기에서 화면에 있는 손 이모지 지우기
      isRecognitionActive = false; // 오류 발생 시 상태 초기화
    };

    recognition.onend = () => {
      console.log("음성 인식이 종료되었습니다.");
      if (isRecognitionActive) {
        // 만약 사용자가 손을 내리지 않았다면 음성 인식을 다시 시작
        recognition.start();
      }
    };
  };

  // 전역 변수로 제스처 인식 상태 관리
  let gestureRecognizer = null;
  let isGestureActive = false;
  let animationFrameId = null;
  let SttTranslatedMessage = ""; //STT 결과 임시 저장

  const initializeGestureRecognizer = async () => {
    const videoElement = videoRef.current;

    videoElement.style.display = "block";
    videoElement.style.position = "absolute";
    videoElement.style.top = "-9999px";
    videoElement.style.left = "-9999px";
    videoElement.style.width = "1px"; //최소한의 로딩을 위해
    videoElement.style.height = "1px";
    videoElement.style.opacity = "0";

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

      gestureRecognizer = await GestureRecognizer.createFromModelPath(
        vision,
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
      );

      if (!gestureRecognizer) {
        console.error("Gesture Recognizer 초기화 실패");
        return;
      }

      await gestureRecognizer.setOptions({ runningMode: "video" });

      console.log("손 감지 대기 중...");
      detectHandPresence(videoElement); // 손 감지 루프 시작
    } catch (error) {
      console.error("Gesture Recognizer 초기화 중 오류 발생:", error);
    }
  };

  // 손 감지 루프 (손이 감지되면 렌더 루프 시작)
  const detectHandPresence = async (videoElement) => {
    const results = await gestureRecognizer.recognizeForVideo(
      videoElement,
      Date.now()
    );

    if (results.gestures && results.gestures.length > 0) {
      if (!isGestureActive) {
        console.log("손 감지됨 - 제스처 인식 시작");
        isGestureActive = true;
        startGestureRecognition(videoElement); // 손이 감지되면 제스처 인식 루프 시작
      }
    } else {
      if (isGestureActive) {
        console.log("손이 화면에서 사라짐 - 제스처 인식 중지");
        isGestureActive = false;
        cancelAnimationFrame(animationFrameId); // 손이 사라지면 루프 중지
      }
    }

    // 짧은 간격 후 다시 손을 감지하도록 설정
    setTimeout(() => {
      detectHandPresence(videoElement);
    }, 200); // 200ms 후 다시 손 감지 시도
  };

  // 손이 감지된 상태에서 제스처 인식 수행
  const startGestureRecognition = async (videoElement) => {
    const results = await gestureRecognizer.recognizeForVideo(
      videoElement,
      Date.now()
    );

    onGestureResults(results);

    if (isGestureActive) {
      animationFrameId = requestAnimationFrame(() => {
        startGestureRecognition(videoElement);
      });
    }
  };

  // 손 제스처 결과 처리
  const onGestureResults = (results) => {
    if (results.gestures && results.gestures.length > 0) {
      const gesture = results.gestures[0][0].categoryName;
      if (gesture === "Open_Palm" && !isRecognitionActive) {
        console.log("손을 들었음, 음성 인식 시작");
        isRecognitionActive = true;
        recognition.start();
      } else if (gesture === "Closed_Fist" && isRecognitionActive) {
        console.log("주먹을 쥐었음, 음성 인식 중지");
        //TODO: 여기서 손 이모지 내리기
        isRecognitionActive = false;
        recognition.stop();
      }
    }
  };

  const sendMessage = (e) => {
    // e.preventDefault();

    console.log("메세지 보내요::" + e);
    if (e === null || e === "") {
      return;
    }

    stompClient.current.publish({
      destination: `/pub/chat/text/rooms/${classData.chatRoomId}`,
      body: e,
    });
  };

  // const sendMessage = (e) => {
  //   // 사용자 정보 가져오기
  //   const token = Cookies.get("token"); // 쿠키에서 토큰 가져오기
  //   // WebSocket 메시지 전송
  //   stompClient.current.publish({
  //     destination: `/pub/chat/text/rooms/${roomId}`,
  //     body: SttTranslatedMessage, //전역 변수 메세지 보내기
  //     headers: {
  //       Authorization: `Bearer ${token}`, // JWT 토큰
  //       username: userInfo.username, // 사용자 이름
  //     },
  //   });
  // };

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
    // console.log(newMode);
    setDisplayMode(newMode);
    setVideoClassName(displaySetting(newMode));
    // console.log(displaySetting(newMode));
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

  const exitOpen = () => {
    setIsExitOpen(!isExitOpen);
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
      <ExitLiveClass
        exitOpen={exitOpen}
        isExitOpen={isExitOpen}
        isHost={isHost}
        isForcedExit={isForcedExit}
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
            isHost={isHost}
            setIsForcedExit={setIsForcedExit}
            displayMode={displayChange}
            captureOpen={captureOpen}
            peopleListOpen={peopleListOpen}
            chatOpen={chatOpen}
            exitOpen={exitOpen}
          />
        </div>
      </div>
      <video
        ref={videoRef}
        className="input_video"
        style={{ display: "none" }}
      ></video>
      {/* <canvas ref={canvasRef} style={{display: "none"}}></canvas> */}
    </>
  );
};

export default VideoComponent;

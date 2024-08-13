const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER;
const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER;

import { Mic, MicOff, Campaign  } from "@mui/icons-material";
import api from "../../service/Api";
import Cookies from "js-cookie";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import StreamComponent from "./StreamComponent";
import ToolbarComponent from "./ToolbarComponent";
import UserModel from "./UserModel";

import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { Client } from "@stomp/stompjs";

import useVideoStore from "./../../store/useVideoStore";
import useMyPageStore from "../../store/MyPageStore";
import useCookingClassStore from "../../store/CookingClassStore";

import MediaDeviceSetting from "./MediaDeviceSetting";
import AttendeeList from "../ChatRoom/AttendeeList";
import ChatLog from "../ChatRoom/ChatLog";
import CameraCapture from "./CameraCapture";
import ExitLiveClass from "./ExitLiveClass";

import "./../../styles/LiveClass/LiveClass.css";
import { OpenVidu } from "openvidu-browser";

const localUserSetting = new UserModel();

const VideoComponent = ({ isHost }) => {
  console.log("비디오컴포넌트의 시작");
  const OV = useVideoStore((state) => state.OV);
  const setOV = useVideoStore((state) => state.setOV);
  const session = useRef(null);
  const currentPublisher = useRef();

  const selectedAudioDevice = useVideoStore(
    (state) => state.selectedAudioDevice
  );
  const selectedVideoDevice = useVideoStore(
    (state) => state.selectedVideoDevice
  );
  const isVideoActive = useVideoStore((state) => state.isVideoActive);
  const isAudioActive = useVideoStore((state) => state.isAudioActive);

  const setSelectedAudioDevice = useVideoStore(
    (state) => state.setSelectedAudioDevice
  );
  const setSelectedVideoDevice = useVideoStore(
    (state) => state.setSelectedVideoDevice
  );
  const setIsVideoActive = useVideoStore((state) => state.setIsVideoActive);
  const setIsAudioActive = useVideoStore((state) => state.setIsAudioActive);

  const userInfo = useMyPageStore((state) => state.informations);
  const classData = useVideoStore((state) => state.classData);

  const [localUser, setLocalUser] = useState(null);
  const [hostUser, setHostUser] = useState(null);
  const [partUser, setPartUser] = useState();

  const remotes = useRef([]);
  const [subscribers, setSubscribers] = useState([]);
  const [userProfileList, setUserProfileList] = useState({});

  const videoRef = useRef(null);

  const localUserAccessAllowed = useRef(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isHostOnly, setIsHostOnly] = useState(true);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isPeopleListOpen, setIsPeopleListOpen] = useState(false);
  const [isSliderOn, setIsSliderOn] = useState(false);
  const [displayMode, setDisplayMode] = useState(1);
  const [isForcedExit, setIsForcedExit] = useState(false);

  // 세션id를 로컬 스토리지에 저장
  const sessionIdRef = useRef(localStorage.getItem("sessionId"));

  const fetchClassDetail = useCookingClassStore(
    (state) => state.fetchClassDetail
  );
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);

  useLayoutEffect(() => {
    if (!classData) {
      fetchClassDetail(localStorage.getItem("classId"));
    }
    if (!userInfo) {
      fetchInformations();
    }
    callPublisher();
  }, []);

  // 로컬 스토리지에 저장된 요소값들을 불러와서 저장
  const callPublisher = useCallback(() => {
    console.log("callPublisher 호출됨");
    const savedVideoDevice = localStorage.getItem("selectedVideoDevice");
    const savedAudioDevice = localStorage.getItem("selectedAudioDevice");
    const savedIsVideoActive = localStorage.getItem("isVideoActive") === "true";
    const savedIsAudioActive = localStorage.getItem("isAudioActive") === "true";

    if (savedVideoDevice) {
      setSelectedVideoDevice(savedVideoDevice);
      setSelectedAudioDevice(savedAudioDevice);
      setIsVideoActive(savedIsVideoActive);
      setIsAudioActive(savedIsAudioActive);
    }
  }, [
    setSelectedVideoDevice,
    setSelectedAudioDevice,
    setIsVideoActive,
    setIsAudioActive,
  ]);

  useEffect(() => {
    callPublisher();
  }, []);

  const [isRecognitionActive, setIsRecognitionActive] = useState(false); //음성 인식 추적 변수 (확성기 표시)
  const recognitionRef = useRef(null);

  //미디어 파이프 및 영상 녹화 관련
  const raiseTimeout = useRef(null);
  const lowerTimeout = useRef(null);
  const audioStream = useRef(null);

  //채팅 관련
  const stompClient = useRef(null);

  // 제스처 인식 상태 관리
  let gestureRecognizer = null;
  let isGestureActive = false;
  let animationFrameId = null;
  let SttTranslatedMessage = ""; //STT 결과 임시 저장

  // 비디오 레이아웃 순서 정렬하는 코드
  useEffect(() => {
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
        if (data.nickname === classData?.hostProfile.nickname) {
          setHostUser(data);
        } else {
          setPartUser((prev) => [...prev, data]);
        }
      });
    }
  }, [subscribers, localUser?.streamManager]);

  // 참여자 목록 정리하는 코드
  useLayoutEffect(() => {
    // console.log(partUser);
    // console.log(userInfo);

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

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);

    joinSession(sessionIdRef.current);

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

    const host = classData?.hostProfile;
    if (host) {
      setUserProfileList({
        [host.username]: [
          host.nickname,
          host.profileImageUrl,
          "HOST",
          host.username,
        ],
      });
    }

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      if (session.current) {
        session.current.disconnect();
      }
    };
  }, [classData]);

  useEffect(() => {
    initializeSpeechRecognition("ko", "KR"); // 기본 언어 설정
    console.log("SpeechRecognition initialized", recognitionRef.current);
  }, []);

  useEffect(() => {
    initializeGestureRecognizer(); // 제스처 초기화
    if (userInfo && userInfo.language && userInfo.language.languageCode) {
      const languageCode = userInfo.language.languageCode.toLowerCase(); // 언어 코드를 소문자로 변환
      const countryCode = userInfo.country.countryCode.toUpperCase();
      initializeSpeechRecognition(languageCode, countryCode); // 음성 인식 초기화
    }
  }, []);

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

  const joinSession = async () => {
    const newOV = OV ? OV : new OpenVidu();
    const newSession = newOV.initSession(sessionIdRef.current);

    setOV(newOV);
    session.current = newSession;

    await connectToSession(newSession, newOV);
    subscribeToStreamCreated(newSession);
    console.log(newSession);
  };

  const connectToSession = async (session, newOV) => {
    try {
      const token = await getToken();
      connect(session, token, newOV);
    } catch (error) {
      console.error(
        "토큰을 가져오는데 문제가 있음 :",
        error.code,
        error.message
      );
      alert("토큰을 가져오는데 문제가 있어용 :", error.message);
    }
  };

  const connect = (session, token, newOV) => {
    session
      .connect(token, { clientData: userInfo.nickname })
      .then(() => {
        connectWebCam(session, newOV);
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

  const connectWebCam = async (session, newOV) => {
    try {
      // 오디오와 비디오 스트림을 함께 가져옵니다.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { deviceId: selectedVideoDevice },
      });

      // 퍼블리셔를 초기화합니다.
      const publisher = newOV.initPublisher(undefined, {
        audioSource: selectedAudioDevice?.deviceId, // 오디오 소스를 설정
        videoSource: selectedVideoDevice?.deviceId,
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

  // 미디어 디바이스 교체
  useEffect(() => {
    console.log("switchCam 호출됨");
    switchCamera();
  }, [selectedVideoDevice]);

  useEffect(() => {
    console.log("switchMic 호출됨");
    switchMic();
  }, [selectedAudioDevice]);

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

    // 호스트 나갔으면 나머지 참여자 내쫓는 코드
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
    if (session.current) {
      session.current.disconnect();
    }
    event.preventDefault();
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
    return await createToken(sessionIdRef.current);
  }, []);

  const createToken = useCallback(async (sessionId) => {
    console.log(sessionId);
    const response = await api.post(
      `${MAIN_SERVER_URL}/classes/live/sessions/${sessionId}/connections`
    );
    console.log(response.data);
    return response.data.data;
  }, []);

  const initializeSpeechRecognition = (languageCode, countryCode) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition API is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = languageCode + "-" + countryCode || "ko-KR";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setIsRecognitionActive(true); // 음성 인식이 시작될 때 상태 업데이트
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setIsRecognitionActive(false); // 음성 인식이 종료될 때 상태 업데이트
      };

      recognitionRef.current.onresult = (event) => {
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

      recognitionRef.current.onerror = (event) => {
        console.error("음성 인식 오류:", event.error);
        setIsRecognitionActive(false);
      };
    }
  };

  const initializeGestureRecognizer = async () => {
    const videoElement = videoRef.current;

    videoElement.style.display = "block";
    videoElement.style.position = "absolute";
    videoElement.style.top = "-9999px";
    videoElement.style.left = "-9999px";
    videoElement.style.width = "100px"; //최소한의 로딩을 위해
    videoElement.style.height = "100px";
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
        startSpeechRecognition();
      } else if (gesture === "Closed_Fist" && isRecognitionActive) {
        console.log("주먹을 쥐었음, 음성 인식 중지");
        stopSpeechRecognition();
      }
    }
  };

  //음성 인식 시작 함수
  const startSpeechRecognition = () => {
    if (recognitionRef.current && recognitionRef.current.state !== "started") {
      console.log("Starting speech recognition...");
      recognitionRef.current.start();
    } else {
      console.log("Speech recognition is already active or object is null");
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
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

  // 비디오 레이이아웃
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

  const displayChange = () => {
    const newMode = (displayMode + 1) % 3;
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

  const prevButton = () => {
    if (ref.current) ref.current.scrollLeft -= 200;
  };
  const nextButton = () => {
    if (ref.current) ref.current.scrollLeft += 200;
  };

  const ref = useRef(null);
  const [videoClassName, setVideoClassName] = useState("w-2/3 mx-8");

  return (
    <>
      {isRecognitionActive ? (
        <div className="absolute top-0 right-0 mr-8 m-8 p-2 text-white flex items-center">
          <Campaign className="mr-2 text-first-700" />
          <span className="text-first-700 text-l">음성 인식 중...</span>
        </div>
      ) : (
        <div className="absolute top-0  right-0 mr-8 m-8 p-2 text-white flex items-center">
          <MicOff className="mr-2 text-first-700" />
          <span className="text-first-700 text-l">음성 인식 꺼짐</span>
        </div>
      )}
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
      <div className="min-h-screen min-w-screen bg-gradient-to-b from-gray-300 to-white flex flex-col items-center justify-center">
        <div className="h-20 w-full flex justify-center items-end mb-5">
          <div className="text-4xl font-bold">{classData?.title}</div>
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
            <div className="w-1/3 mx-3 my-20  mb-24 mr-12 border-solid flex flex-col h-full">
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
            <div className="w-1/3 mx-3 my-12 mr-12 mb-12 border-solid flex flex-col h-[32rem]">
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

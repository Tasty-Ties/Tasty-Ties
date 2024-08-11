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

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import "./../../styles/LiveClass/LiveClass.css";
import IconButton from "../../common/components/IconButton";

const localUserSetting = new UserModel();

//채팅 관련
const roomId = "66a9c5dd498fe728acb763f8";
const userId = 1;
const userLang = "Japanese";
const CHUNK_SIZE = 16000;

const VideoComponent = ({ isHost, title, hostName }) => {
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

  const [localUser, setLocalUser] = useState(null);
  const session = useRef(null);
  const [subscribers, setSubscribers] = useState([]);

  const [hostUser, setHostUser] = useState(null);
  const [partUser, setPartUser] = useState();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        if (data.nickname === hostName) {
          setHostUser(data);
        } else {
          setPartUser((prev) => [...prev, data]);
        }
      });
    }
  }, [subscribers, localUser]);

  const remotes = useRef([]);
  const localUserAccessAllowed = useRef(false);

  const sessionId = useVideoStore((state) => state.sessionId);
  const currentPublisher = useRef();

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
    });

    connectStompClient();

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      leaveSession();
    };
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true, // 여기서 오디오 스트림도 가져옵니다.
        video: { deviceId: selectedVideoDevice.deviceId },
      });

      const publisher = OV.initPublisher(undefined, {
        audioSource: stream.getAudioTracks()[0], // 오디오 트랙을 사용합니다.
        videoSource: stream.getVideoTracks()[0],
        publishAudio: isAudioActive,
        publishVideo: isVideoActive,
        resolution: "1280x720",
        frameRate: 30,
        insertMode: "APPEND",
      });

      currentPublisher.current = publisher;
      audioStream.current = stream; // 오디오 스트림을 저장합니다.

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

  // 전역 변수로 제스처 인식 상태 관리
  let gestureRecognizer = null;
  let isGestureActive = false;
  let animationFrameId = null;

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

  // 제스처 결과 처리
  const onGestureResults = (results) => {
    if (results.gestures && results.gestures.length > 0) {
      const gesture = results.gestures[0][0].categoryName;

      if (gesture === "Open_Palm") {
        console.log("손을 들었음");
        if (!isRecording.current) {
          startRecording();
        }
      } else if (gesture === "Closed_Fist") {
        console.log("주먹을 쥐었음");
        if (isRecording.current) {
          stopRecording();
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
      saveAudioFile(audioBlob);
      // sendRecordingToServer(audioBlob);
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHostOnly, setIsHostOnly] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isPeopleListOpen, setIsPeopleListOpen] = useState(false);
  const [isSliderOn, setIsSliderOn] = useState(true);
  const [displayMode, setDisplayMode] = useState(0);

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

  const liveClassImage = useVideoStore((state) => state.liveClassImage);
  const setLiveClassImage = useVideoStore((state) => state.setLiveClassImage);

  const takePhoto = (e) => {
    if (
      isCaptureOpen &&
      document.getElementById(
        "video-" + localUser.getStreamManager().stream.streamId
      )
    ) {
      console.log(
        document.getElementById(
          "video-" + localUser.getStreamManager().stream.streamId
        )
      );
      const canvas = canvasRef.current;
      const video = document.getElementById(
        "video-" + localUser.getStreamManager().stream.streamId
      );
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      setLiveClassImage(e.target.value, dataUrl);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "screenshot.jpg";
      link.click();
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

  const [videoClassName, setVideoClassName] = useState("");

  return (
    <>
      <Dialog
        open={isCaptureOpen}
        onClose={captureOpen}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-50 w-4/6 overflow-y-auto place-self-center">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-left sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      현재 사진이 마음에 드신다면, 버튼을 클릭하여 저장해보세요!
                      <br />
                      사진은 자유롭게 변경이 가능하며, 최대 4장의 사진까지 저장
                      가능합니다.
                    </DialogTitle>

                    <div className="mt-2 grid grid-cols-4 grid-rows-2 gap-2">
                      {liveClassImage[0] ? (
                        <img src={liveClassImage[0]} />
                      ) : (
                        <IconButton
                          type="screen-capture"
                          icon="screen-capture"
                          onClick={takePhoto}
                          value="0"
                        />
                      )}
                      {liveClassImage[1] ? (
                        <img src={liveClassImage[1]} />
                      ) : (
                        <IconButton
                          type="screen-capture"
                          icon="screen-capture"
                          onClick={takePhoto}
                          value="1"
                        />
                      )}
                      <div className="col-start-3 col-span-2 row-start-1 row-span-2">
                        <StreamComponent user={localUser} />
                      </div>
                      {liveClassImage[2] ? (
                        <img src={liveClassImage[2]} />
                      ) : (
                        <IconButton
                          type="screen-capture"
                          icon="screen-capture"
                          onClick={takePhoto}
                          value="2"
                        />
                      )}
                      {liveClassImage[3] ? (
                        <img src={liveClassImage[3]} />
                      ) : (
                        <IconButton
                          type="screen-capture"
                          icon="screen-capture"
                          onClick={takePhoto}
                          value="3"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 flex justify-end">
                <IconButton
                  text="다시 촬영하기"
                  icon="take-photo"
                  type="green-border-short"
                />
                <IconButton
                  text="임시저장"
                  icon="take-photo"
                  type="green-border-short"
                />
                <IconButton
                  text="저장하기"
                  icon="download-photo"
                  type="green-border-short"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
        <div className="h-20 w-full flex justify-center items-center">
          <div className="text-2xl">{title}</div>
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
          {isChatOpen && <ChatComponent stompClient={stompClient} />}
          {isPeopleListOpen && <PeopleListComponent />}
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
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default VideoComponent;

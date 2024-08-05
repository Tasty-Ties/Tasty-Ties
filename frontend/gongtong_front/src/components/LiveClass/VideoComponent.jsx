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
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import "./../../styles/LiveClass/LiveClass.css";
import { Stream } from "openvidu-browser";
import Button from "../../common/components/Button";
import IconButton from "../../common/components/IconButton";

const localUserSetting = new UserModel();

//채팅 관련
const CHAT_SERVER_URL = "ws://localhost:8081/chat";
const roomId = "66a9c5dd498fe728acb763f8";
const userId = 1;
const userLang = "Japanese";
const CHUNK_SIZE = 1600;

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
  // const hostUser = useRef(null);
  // const partUser = useRef([]);

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
          console.log("호스트와 닉네임이 일치함");
          setHostUser(data);
        } else {
          setPartUser((prev) => [...prev, data]);
        }
      });
    }

    console.log("호스트유저출력: ", hostUser);
    console.log("참가자유저출력: ", partUser);
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

  // const [mySessionId, setMySessionId] = useState("SessionA");
  // const [myUserName, setMyUserName] = useState(
  //   "OpenVidu_User" + Math.floor(Math.random() * 100)
  // );

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
    const publisher = OV.initPublisher(undefined, {
      audioSource: selectedAudioDevice,
      videoSource: selectedVideoDevice.deviceId,
      publishAudio: isAudioActive,
      publishVideo: isVideoActive,
      resolution: "1280x720",
      frameRate: 30,
      insertMode: "APPEND",
    });
    currentPublisher.current = publisher;
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
    // setMySessionId("SessionA");
    setLocalUser(undefined);
    remotes.current.length = 0;
  };

  const getToken = useCallback(async () => {
    // const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  }, []);

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
      const stopTime = performance.now(); // 녹화 중지 시각
      console.log(`Recording stopped. Duration: ${stopTime - startTime} ms`); // 녹화 기간

      console.log("음성 파일 서버에 전송");
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      sendRecordingToServer(audioBlob);
    };

    const startTime = performance.now();
    mediaRecorder.current.start();
    console.log("Recording started");
  };

  // 서버로 오디오 보내기
  const sendRecordingToServer = (audioBlob, recordingStopTime) => {
    const reader = new FileReader();
    const sendStartTime = performance.now(); //전송 시간 측정 시작

    reader.onload = () => {
      const arrayBuffer = reader.result;
      const totalChunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const chunk = arrayBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const uint8ArrayChunk = new Uint8Array(chunk);

        const chatMessage = {
          userId: parseInt(userId),
          fileContent: Array.from(uint8ArrayChunk), // ArrayBuffer를 전송 가능하게 변환
          chunkIndex: i,
          totalChunks: totalChunks,
        };

        console.log(`Sending chunk ${i + 1} of ${totalChunks}`);
        stompClient.current.publish({
          destination: `/pub/chat/voice/rooms/${roomId}`,
          body: JSON.stringify(chatMessage),
        });

        if (i === totalChunks - 1) {
          const sendEndTime = performance.now(); //전송 끝 시간
          console.log(
            `Sending completed. Time taken: ${sendEndTime - sendStartTime} ms` //전송 토탈 시간
          );
          
        }
      }
    };

    reader.readAsArrayBuffer(audioBlob);
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
    setVideoClassName(displaySetting(displayMode));
  }, [isChatOpen, isPeopleListOpen]);

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

  const canvasRef = useRef();

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
          {isChatOpen && <ChatComponent />}
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
      <video className="input_video" style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default VideoComponent;

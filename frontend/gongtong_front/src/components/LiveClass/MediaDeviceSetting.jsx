import { useState, useEffect } from "react";
import useVideoStore from "../../store/useVideoStore";
import Button from "./../../common/components/Button";

const MediaDeviceSetting = ({ currentPublisher }) => {
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);

  const OV = useVideoStore((state) => state.OV);
  const setSelectedAudioDevice = useVideoStore(
    (state) => state.setSelectedAudioDevice
  );
  const setSelectedVideoDevice = useVideoStore(
    (state) => state.setSelectedVideoDevice
  );

  const isAudioActive = useVideoStore((state) => state.isAudioActive);
  const isVideoActive = useVideoStore((state) => state.isVideoActive);
  const setIsVideoActive = useVideoStore((state) => state.setIsVideoActive);
  const setIsAudioActive = useVideoStore((state) => state.setIsAudioActive);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const devices = await OV.getDevices();
        setVideoDevices(
          devices.filter((device) => device.kind === "videoinput")
        );
        setAudioDevices(
          devices.filter((device) => device.kind === "audioinput")
        );
      } catch (error) {
        console.error(
          "디바이스를 가져오는 과정에서 오류가 발생했어용: ",
          error
        );
      }
    };
    if (OV) {
      getMediaDevices();
    }
  }, [OV]);

  useEffect(() => {
    if (audioDevices.length > 0 && audioDevices.length > 0) {
      setSelectedAudioDevice(audioDevices[0].deviceId);
      setSelectedVideoDevice(videoDevices[0].deviceId);
    }
  }, [videoDevices, audioDevices]);

  const videoOnOff = () => {
    if (currentPublisher) {
      currentPublisher.current.publishVideo(!isVideoActive);
    }
    setIsVideoActive();
  };

  const audioOnOff = () => {
    if (currentPublisher) {
      currentPublisher.current.publishAudio(!isAudioActive);
    }
    setIsAudioActive();
  };

  const audioDeviceSetting = () => {};

  const videoDeviceSetting = () => {};

  return (
    <>
      <div className="flex flex-row space-x-2 pr-2">
        {/* <Button
          text={isVideoActive ? "비디오 중지" : "비디오 시작"}
          type="green-border-short"
          onClick={videoOnOff}
        />
        <Button
          text={isAudioActive ? "오디오 중지" : "오디오 시작"}
          type="green-border-short"
          onClick={audioOnOff}
        /> */}

        <button className="bg-transparent hover:bg-transparent text-first font-semibold hover:text-first-600 py-2 px-4 border border-first hover:border-first-600 rounded-full items-center flex flex-row space-x-2">
          <div className="flex flex-row space-x-2" onClick={videoOnOff}>
            {isVideoActive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                />
              </svg>
            )}
            <p>{isVideoActive ? "비디오 중지" : "비디오 시작"}</p>
          </div>

          <div onClick={videoDeviceSetting}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 self-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </button>

        <div className="absolute bg-white">미디어 디바이스</div>
        <button className="bg-transparent hover:bg-transparent text-first font-semibold hover:text-first-600 py-2 px-4 border border-first hover:border-first-600 rounded-full items-center flex flex-row space-x-2 relative">
          <div className="flex flex-row space-x-2" onClick={audioOnOff}>
            {isAudioActive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
                <line
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                  stroke="currentColor" // 선 색상
                  strokeWidth={1.5} // 선 굵기
                />
              </svg>
            )}
            <p>{isAudioActive ? "오디오 중지" : "오디오 시작"}</p>
          </div>
          <div onClick={audioDeviceSetting}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 self-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </button>

        {/* <label>Video Devices: </label>
        <select
          onChange={(e) =>
            setSelectedVideoDevice(
              videoDevices.find((device) => device.deviceId === e.target.value)
            )
          }
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Audio Devices: </label>
        <select
          onChange={(e) =>
            setSelectedAudioDevice(
              audioDevices.find((device) => device.deviceId === e.target.value)
            )
          }
        >
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select> */}
      </div>
    </>
  );
};

export default MediaDeviceSetting;

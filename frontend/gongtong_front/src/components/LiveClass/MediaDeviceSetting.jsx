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

  return (
    <>
      <div>
        <Button
          text={isVideoActive ? "비디오 중지" : "비디오 시작"}
          type="green-border-short"
          onClick={videoOnOff}
        />
        <Button
          text={isAudioActive ? "오디오 중지" : "오디오 시작"}
          type="green-border-short"
          onClick={audioOnOff}
        />
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

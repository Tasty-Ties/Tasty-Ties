import { OpenVidu } from "openvidu-browser";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useVideoStore from "./../store/useVideoStore";
import MediaDeviceSetting from "./../components/LiveClass/MediaDeviceSetting";

const ClassWaiting = () => {
  const nav = useNavigate();

  const OV = useVideoStore((state) => state.OV);
  const setOV = useVideoStore((state) => state.setOV);

  const selectedAudioDevice = useVideoStore(
    (state) => state.selectedAudioDevice
  );
  const selectedVideoDevice = useVideoStore(
    (state) => state.selectedVideoDevice
  );

  const [audioActive, setAudioActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  const videoPreviewRef = useRef(null);

  useEffect(() => {
    setOV(new OpenVidu());
  }, []);

  useEffect(() => {
    if (selectedVideoDevice) {
      startPreview();
    }
  }, [selectedAudioDevice, selectedVideoDevice]);

  const startPreview = async () => {
    if (selectedVideoDevice) {
      const stream = await OV.getUserMedia({
        audioSource: selectedAudioDevice,
        videoSource: selectedVideoDevice.deviceId,
      });
      videoPreviewRef.current.srcObject = stream;
    }
  };

  return (
    <div>
      <h2>
        {"호스트 이름"}님의 {"클래스 제목"} 클래스 시작을 기다리는 중...
      </h2>

      <MediaDeviceSetting />

      <div>
        <video
          ref={videoPreviewRef}
          autoPlay
          playsInline
          style={{ width: "640px" }}
        ></video>
      </div>

      <button
        onClick={() =>
          nav("/liveclass", {
            state: {
              audioActive: audioActive,
              videoActive: videoActive,
            },
          })
        }
      >
        클래스 입장
      </button>
    </div>
  );
};

export default ClassWaiting;

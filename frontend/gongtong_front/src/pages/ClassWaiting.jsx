import { OpenVidu } from "openvidu-browser";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import useVideoStore from "./../store/useVideoStore";
import MediaDeviceSetting from "./../components/LiveClass/MediaDeviceSetting";

import axios from "axios";
import Cookies from "js-cookie";

const ClassWaiting = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { classData, isHost } = location.state;
  console.log(classData);
  console.log(isHost);

  const OV = useVideoStore((state) => state.OV);
  const setOV = useVideoStore((state) => state.setOV);

  const setSessionId = useVideoStore((state) => state.setSessionId);

  const selectedAudioDevice = useVideoStore(
    (state) => state.selectedAudioDevice
  );
  const selectedVideoDevice = useVideoStore(
    (state) => state.selectedVideoDevice
  );

  const isAudioActive = useVideoStore((state) => state.isAudioActive);
  const isVideoActive = useVideoStore((state) => state.isVideoActive);

  const videoPreviewRef = useRef(null);

  useEffect(() => {
    setOV(new OpenVidu());
  }, []);

  useEffect(() => {
    if (selectedVideoDevice) {
      startPreview();
    }
  }, [selectedAudioDevice, selectedVideoDevice, isAudioActive, isVideoActive]);

  const startPreview = async () => {
    if (selectedVideoDevice) {
      const stream = await OV.getUserMedia({
        audioSource: isAudioActive ? selectedAudioDevice : false,
        videoSource: isVideoActive ? selectedVideoDevice.deviceId : false,
      });
      videoPreviewRef.current.srcObject = stream;
    }
  };

  const EntryTry = async () => {
    if (isHost) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/classes/live/sessions/${classData.uuid}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        console.log(response.data.data);
        setSessionId(response.data.data);
      } catch (error) {
        console.log(error);
        alert("오류 발생으로 리턴");
        return;
      }
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/classes/live/sessions/${classData.uuid}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        console.log(response);
        setSessionId(response.data.data);
      } catch (error) {
        console.log(error);
        alert("오류 발생으로 리턴");
        return;
      }
    }

    nav("/liveclass", {
      state: {
        isHost: isHost,
      },
    });
  };

  return (
    <div>
      <h2>
        {classData.hostName}님의 {classData.title} 클래스 시작을 기다리는 중...
      </h2>

      <div>
        <video
          ref={videoPreviewRef}
          autoPlay
          playsInline
          style={{ width: "640px" }}
        ></video>
      </div>
      <div className="flex">
        <MediaDeviceSetting currentPublisher={null} />
        <button onClick={EntryTry}>클래스 입장</button>
      </div>
    </div>
  );
};

export default ClassWaiting;

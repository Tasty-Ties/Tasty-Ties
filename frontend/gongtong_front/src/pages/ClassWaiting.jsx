const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER;

import { OpenVidu } from "openvidu-browser";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import useVideoStore from "./../store/useVideoStore";
import MediaDeviceSetting from "./../components/LiveClass/MediaDeviceSetting";

import axios from "axios";
import Cookies from "js-cookie";
import Button from "../common/components/Button";

const ClassWaiting = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { classData, isHost } = location.state;
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
      console.log(isAudioActive, selectedAudioDevice);
      const stream = await OV.getUserMedia({
        audioSource: isAudioActive ? selectedAudioDevice?.deviceId : false,
        videoSource: isVideoActive ? selectedVideoDevice.deviceId : false,
        resolution: "1280x720",
      });
      videoPreviewRef.current.srcObject = stream;
    }
  };

  const EntryTry = async () => {
    if (isHost) {
      try {
        const response = await axios.post(
          MAIN_SERVER_URL + `/classes/live/sessions/${classData.uuid}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        setSessionId(response.data.data);
      } catch (error) {
        console.log(error);
        alert("오류 발생으로 리턴");
        return;
      }
    } else {
      try {
        const response = await axios.get(
          MAIN_SERVER_URL + `/classes/live/sessions/${classData.uuid}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        setSessionId(response.data.data);
      } catch (error) {
        if (error.response.data.stateCode === 404) {
          alert("아직 클래스가 생성되지 않았습니다.");
        } else {
          alert("오류 발생으로 리턴");
        }
        return;
      }
    }

    nav("/liveclass", {
      state: {
        isHost: isHost,
        title: classData.title,
        hostName: classData.hostName,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="text-2xl pt-2 self-center">
        {isHost ? (
          <div>
            클래스 시작 버튼을 눌러 {classData.title} 클래스를 시작해주세요
          </div>
        ) : (
          <div>
            {classData.hostName}님의 {classData.title} 클래스 시작을 기다리는
            중...
          </div>
        )}
      </div>
      <div className="px-64 py-2 flex self-center">
        {isVideoActive ? (
          <video
            ref={videoPreviewRef}
            autoPlay
            playsInline
            className="transform scale-x-[-1]"
          ></video>
        ) : (
          <img
            className=""
            src="https://cdn.pixabay.com/video/2023/11/22/190276-887495682_tiny.jpg"
          />
        )}
      </div>
      <div className="flex flex-row self-center pt-1">
        <MediaDeviceSetting currentPublisher={null} />
        <Button
          text={isHost ? "클래스 시작" : "클래스 입장"}
          type="green-short"
          onClick={EntryTry}
          className="self-center"
        />
      </div>
    </div>
  );
};

export default ClassWaiting;

const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER;

import { OpenVidu } from "openvidu-browser";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import useVideoStore from "./../store/useVideoStore";
import MediaDeviceSetting from "./../components/LiveClass/MediaDeviceSetting";

import api from "./../service/Api";
import Button from "../common/components/Button";
import { getClassDetail } from "../service/CookingClassAPI";
import useMyPageStore from "../store/MyPageStore";

const ClassWaiting = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { classId, isHost } = location.state;

  const userInfo = useMyPageStore((state) => state.informations);
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);

  const OV = useVideoStore((state) => state.OV);
  const setOV = useVideoStore((state) => state.setOV);

  const classData = useVideoStore((state) => state.classData);
  const setSessionId = useVideoStore((state) => state.setSessionId);
  const setClassData = useVideoStore((state) => state.setClassData);

  const selectedAudioDevice = useVideoStore(
    (state) => state.selectedAudioDevice
  );
  const selectedVideoDevice = useVideoStore(
    (state) => state.selectedVideoDevice
  );

  const isAudioActive = useVideoStore((state) => state.isAudioActive);
  const isVideoActive = useVideoStore((state) => state.isVideoActive);

  const videoPreviewRef = useRef(null);

  const getClassInfo = async () => {
    setClassData(await getClassDetail(classId));
    console.log("클래스 인포를 가져옵니다.", classId);
  };

  useEffect(() => {
    setOV(new OpenVidu());
    getClassInfo();
    if (userInfo.length === 0) {
      fetchInformations();
    }
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
        const response = await api.post(
          `/classes/live/sessions/${classData.uuid}`
        );
        setSessionId(response.data.data);
      } catch (error) {
        const status = error.response?.data.status;
        switch (status) {
          case 403:
            alert("해당 클래스의 호스트가 아닙니다.");
            nav("/mypage");
            break;
          case 404:
            alert("해당 쿠킹 클래스가 존재하지 않습니다.");
            nav("/class");
            break;
          default:
        }
        console.error(error);
        return;
      }
    } else {
      try {
        const response = await api.get(
          `/classes/live/sessions/${classData.uuid}`
        );
        setSessionId(response.data.data);
      } catch (error) {
        const status = error.response.data.status;
        switch (status) {
          case 403:
            alert("해당 클래스의 게스트가 아닙니다.");
            nav("/mypage");
            break;
          case 404:
            alert("호스트가 아직 클래스를 시작하지 않았습니다.");
            break;
          default:
        }
        console.error(error);
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
    <div className="flex flex-col">
      <div className="text-2xl pt-2 self-center">
        {isHost ? (
          <div>
            클래스 시작 버튼을 눌러 {classData?.title} 클래스를 시작해주세요
          </div>
        ) : (
          <div>
            {classData?.hostProfile.nickname}님의 {classData?.title} 클래스
            시작을 기다리는 중...
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

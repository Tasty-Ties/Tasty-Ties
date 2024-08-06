import VideoComponent from "../components/LiveClass/VideoComponent";
import ChatComponent from "../components/LiveClass/ChatComponent";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LiveClass = () => {
  const { isHost, title, hostName } = useLocation().state;

  // 스크롤 막는 코드
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return <VideoComponent isHost={isHost} title={title} hostName={hostName} />;
};

export default LiveClass;

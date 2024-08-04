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

  const flexbox = {
    display: "flex",
  };
  const vid = {
    width: "75%",
    height: "device-height",
  };

  return (
    <div style={flexbox}>
      <div style={vid}>
        <VideoComponent isHost={isHost} title={title} hostName={hostName} />
      </div>
      <div>
        <ChatComponent isHost={isHost} />
      </div>
    </div>
  );
};

export default LiveClass;

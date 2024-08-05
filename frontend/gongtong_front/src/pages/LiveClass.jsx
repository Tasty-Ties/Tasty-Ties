import VideoComponent from "../components/LiveClass/VideoComponent";
import ChatComponent from "../components/LiveClass/ChatComponent";
import { useEffect } from "react";

const LiveClass = () => {
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
        <VideoComponent />
      </div>
      <div>
        <ChatComponent />
      </div>
    </div>
  );
};

export default LiveClass;

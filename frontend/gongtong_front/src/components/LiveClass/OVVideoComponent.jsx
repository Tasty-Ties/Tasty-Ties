import React, { useRef, useEffect, useState } from "react";
import useVideoStore from "../../store/useVideoStore";
import useMyPageStore from "../../store/MyPageStore";

const OvVideoComponent = ({ user }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (user && user.streamManager && videoRef && videoRef.current) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
  }, [user]);

  console.log(videoRef);

  return (
    <div>
      <div className="relative">
        <label className="absolute left-2 top-2 z-50 bg-white">
          {user.nickname}
        </label>
        <video
          autoPlay={true}
          id={"video-" + user.getStreamManager().stream.streamId}
          ref={videoRef}
        />
      </div>
    </div>
  );
};

export default OvVideoComponent;

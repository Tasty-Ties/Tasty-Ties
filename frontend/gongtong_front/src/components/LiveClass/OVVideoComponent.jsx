import React, { useRef, useEffect } from "react";

const OvVideoComponent = ({ user }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (user && user.streamManager && videoRef && videoRef.current) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
    console.log(user);
    console.log(user.nickname);
  }, [user]);

  return (
    <div>
      <div className="relative">
        <label className="absolute left-2 top-2 z-50 p-1 rounded-xl px-3 bg-gray-900 text-white opacity-80">
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

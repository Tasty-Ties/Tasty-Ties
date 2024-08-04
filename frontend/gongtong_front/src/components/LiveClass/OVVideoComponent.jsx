import React, { useRef, useEffect, useState } from "react";

const OvVideoComponent = ({ user }) => {
  const videoRef = useRef(null);
  const [isUserAvailable, setIsUserAvailable] = useState(true);

  useEffect(() => {
    if (user && user.streamManager && videoRef.current) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
  }, [user]);

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

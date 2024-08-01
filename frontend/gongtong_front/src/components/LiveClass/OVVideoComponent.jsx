import React, { useRef, useEffect, useState } from "react";

const OvVideoComponent = ({ user }) => {
  const videoRef = useRef(null);
  const [isUserAvailable, setIsUserAvailable] = useState(true);

  useEffect(() => {
    if (user && user.streamManager && videoRef.current) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
    console.log(user);

    if (document.getElementsByTagName("video"))
      console.log(document.getElementsByTagName("video").length);
  }, [user]);

  const vidcss = {
    position: "relative",
    width: "inherit",
    height: "480px",
  };

  const nicknamecss = {
    zIndex: "5",
    position: "absolute",
    backgroundColor: "white",
  };

  const boxcss = {
    margin: "0px 0px 0px 0px",
  };

  return (
    <div>
      {isUserAvailable ? (
        <div style={boxcss}>
          <label style={nicknamecss}>{user.connectionId}</label>
          <video
            style={vidcss}
            autoPlay={true}
            id={"video-" + user.getStreamManager().stream.streamId}
            ref={videoRef}
          />
        </div>
      ) : (
        <img
          src="path/to/placeholder-image.jpg"
          alt="No user"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default OvVideoComponent;

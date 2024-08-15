import React, { useState, useRef } from "react";

const ShortformListItem = ({ vedioUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="w-full rounded-lg shadow overflow-hidden aspect-w-16 aspect-h-9 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video ref={videoRef} className="w-full h-full object-contain" controls={isHovered}>
        <source src={vedioUrl ? vedioUrl : "/vedios/main/sample_shortform.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"></div>
      )}
    </div>
  );
};

export default ShortformListItem;

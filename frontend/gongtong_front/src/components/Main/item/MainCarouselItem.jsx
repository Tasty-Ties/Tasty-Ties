import React from "react";

const MainCarouselItem = ({ children, className }) => {
  return <div className={`h-screen flex justify-center items-center ${className}`}>{children}</div>;
};

export default MainCarouselItem;

import React from "react";
import CookingClassList from "./CookingClassList";
import ShortfromList from "./ShortformList";

const Main = () => {
  return (
    <div className="flex flex-col">
      <CookingClassList />
      <img
        className="w-[70%] h-[20%] mx-auto object-cover object-center mt-24"
        src="/images/main/이번달재료_토마토.png"
        alt="nature image"
      />
      <ShortfromList />
    </div>
  );
};

export default Main;

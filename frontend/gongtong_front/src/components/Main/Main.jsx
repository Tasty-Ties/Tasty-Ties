import React from "react";
import CookingClassList from "./CookingClassList";
import ShortfromList from "./ShortformList";
import { Typography } from "@material-tailwind/react";

const Main = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-center items-center bg-first-600 w-full h-76">
        <div className="h-full w-[62%] mx-auto flex justify-between">
          <div className="flex flex-col justify-center">
            <Typography variant="h2" color="white" className="font-nanum">
              한입에 담긴 세계 여행
            </Typography>
            <Typography className="mt-8 font-nanum" color="white">
              다양한 나라의 음식을 통해 새로운 문화를 탐험해보세요.
            </Typography>
            <Typography color="white" className="font-nanum">
              맛으로 떠나는 글로벌 여행, 지금 시작하세요.
            </Typography>
          </div>
          <img className="h-full mr-8" src="/images/main/main_culture.png" />
        </div>
      </div>
      <div className="flex flex-col w-[72%] mx-auto mt-20 mb-28">
        <CookingClassList />
        <ShortfromList />
      </div>
    </div>
  );
};

export default Main;

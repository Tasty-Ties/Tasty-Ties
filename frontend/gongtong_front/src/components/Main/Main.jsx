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
            <Typography variant="h2" color="white">
              한입에 담긴 세계 여행
            </Typography>
            <Typography className="mt-8" color="white">
              다양한 나라의 음식을 통해 새로운 문화를 탐험해보세요.
            </Typography>
            <Typography color="white">맛으로 떠나는 글로벌 여행, 지금 시작하세요.</Typography>
          </div>
          <img className="h-full mr-8" src="/images/main/main_culture.png" />
        </div>
      </div>
      <div className="flex flex-col w-[72%] mx-auto mt-20">
        <CookingClassList />
        <div className="h-[20%] w-[92%] mx-auto flex justify-between bg-third-800 mt-20">
          <div className="flex flex-col justify-center ml-20">
            <Typography color="white" className="font-bold">
              이번 달 재료
            </Typography>
            <Typography variant="h1" color="white" className="font-bold">
              토마토
            </Typography>
            <Typography className="mt-12 font-bold" color="white">
              토마토의 상큼하고 달콤한 맛으로 일상에 기분 좋은 변화를 가져오세요.
            </Typography>
            <Typography color="white" className="font-bold">
              신선한 토마토로 자신만의 개성과 지역의 독특한 맛을 자연스럽게 담아내 보세요.
            </Typography>
          </div>
          <img className="h-full" src="/images/main/토마토.jpg" />
        </div>
        <ShortfromList />
      </div>
    </div>
  );
};

export default Main;

import { Button, Textarea } from "@material-tailwind/react";
import Check from "./../../assets/완료.png";

import { useState } from "react";
import useVideoStore from "../../store/useVideoStore";

import { useNavigate } from "react-router-dom";
import api from "../../service/Api";

const ReviewWrite = () => {
  const navigate = useNavigate();
  const classData = useVideoStore((state) => state.classData);

  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 max-w-lg mx-auto">
      <img src={Check} alt="완료표시" className="size-36 mb-10" />
      <p className="font-bold text-xl mb-6">
        실시간 요리 교실이 종료되었습니다.
      </p>
      <p className="text-lg text-first mb-4">{classData.title}</p>
      <p className="text-lg text-first mb-6">
        {classData !== null
          ? `${classData.cookingClassStartTime.substring(
              0,
              4
            )}.${classData.cookingClassStartTime.substring(
              5,
              7
            )}.${classData.cookingClassStartTime.substring(
              8,
              10
            )} ${classData.cookingClassStartTime.substring(11, 16)} ~
        ${classData.cookingClassEndTime.substring(
          5,
          7
        )}.${classData.cookingClassEndTime.substring(
              8,
              10
            )} ${classData.cookingClassEndTime.substring(11, 16)}`
          : ""}
      </p>
      <Button
        className="bg-first mt-5 w-full"
        type="green-long"
        onClick={() => navigate("/")}
      >
        메인으로 이동
      </Button>
    </div>
  );
};

export default ReviewWrite;

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import Check from "../../assets/완료.png";

import useVideoStore from "../../store/useVideoStore";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "./../../service/Api";
import useMyPageStore from "../../store/MyPageStore";
import Complete from "../../common/pages/Complete";

const ReviewWrite = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 max-w-lg mx-auto">
      <img src={Check} alt="완료표시" className="size-36 mb-10" />
      <p className="font-bold text-xl mb-6">
        실시간 요리 교실이 종료되었습니다.
      </p>
      <p className="text-lg text-first mb-4">백종원의 요리교실</p>
      <p className="text-lg text-first mb-6">
        2024.08.14 12:00 ~ 2024.08.14 12:30
      </p>
      <p className="text-sm mb-6">고생한 호스트를 위해 수강평을 남겨주세요.</p>
      <Textarea label="수강평" className="mb-4"/>
      <Button className="bg-first w-full mt-4">등록</Button>
      <Button
        className="bg-first mt-5 w-full"
        type="green-long"
        onClick={() => nav("/")}
      >메인으로 이동 </Button>
    </div>
  );
};

export default ReviewWrite;

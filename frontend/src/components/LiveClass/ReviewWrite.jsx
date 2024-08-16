import { Button, Textarea } from "@material-tailwind/react";
import Check from "./../../assets/완료.png";

import { useEffect, useState } from "react";
import useVideoStore from "../../store/useVideoStore";

import { useNavigate } from "react-router-dom";
import api from "./../../service/Api";
import { pushApiErrorNotification, pushNotification } from "../common/Toast";

const ReviewWrite = () => {
  const navigate = useNavigate();
  const classData = useVideoStore((state) => state.classData);
  const [comment, setComment] = useState();

  console.log(classData);
  const registReview = async () => {
    if (comment.trim() === "") {
      alert("수강평을 작성해주세요.");
      return;
    }

    try {
      const response = await api.post("/classes/reviews", {
        uuid: classData.uuid,
        comment: comment,
      });

      if (response.status === 200 || response.status === 201) {
        pushNotification("success", "수강평이 등록되었습니다.");
        navigate("/album");
      } else {
        pushNotification(
          "error",
          "수강평 등록에 실패했습니다. 다시 시도해주세요."
        );
      }
    } catch (e) {
      pushApiErrorNotification(e);
    }
  };
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
      <p className="text-sm mb-6">고생한 호스트를 위해 수강평을 남겨주세요.</p>
      <Textarea
        label="수강평"
        className="mb-4"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <Button
        className="bg-first mt-5 w-full"
        type="green-long"
        onClick={() => {
          registReview();
        }}
      >
        등록
      </Button>
      <Button
        className="bg-first mt-5 w-full"
        type="green-long"
        onClick={() => {
          navigate("/");
        }}
      >
        메인으로 이동
      </Button>
    </div>
  );
};

export default ReviewWrite;

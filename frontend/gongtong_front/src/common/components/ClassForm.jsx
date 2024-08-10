import "../../styles/MyPage/Class.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Button from "./Button";

const Class = ({ classInfo }) => {
  const nav = useNavigate();
  const location = useLocation();

  const date = classInfo.startTime.substring(
    0,
    classInfo.startTime.indexOf("T")
  );
  const startTime = classInfo.startTime.substring(
    classInfo.startTime.indexOf("T") + 1,
    classInfo.startTime.indexOf("T") + 6
  );
  const endTime = classInfo.endTime.substring(
    classInfo.endTime.indexOf("T") + 1,
    classInfo.endTime.indexOf("T") + 6
  );

  // startTime 설정
  let startdate = new Date(classInfo.startTime);

  // 현재 시간
  let now = new Date();

  // 시간 차이를 밀리초로 계산
  let diff = startdate - now;

  // 밀리초를 일, 시간, 분, 초로 변환
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // let timeRemaining = "";
  // if (days > 0) {
  //   timeRemaining += `D-${days}`;
  // } else if (hours > 0) {
  //   timeRemaining += `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  // } else {
  //   timeRemaining += "입장";
  // }

  const timeRemaining = "입장";

  return (
    <div className="flex">
      <div>
        <img src={classInfo.mainImage} alt="클래스사진" className="w-60 h-40" />
      </div>
      <div>
        <h3>{classInfo.title}</h3>

        <p>
          {date} {startTime}~{endTime}
        </p>
        <button onClick={() => nav(`/class/${classInfo.uuid}`)}>
          상세 보기
        </button>
      </div>
      <div>
        <Button
          text={timeRemaining}
          type={timeRemaining === "입장" ? "orange-sqr" : "gray-sqr"}
          onClick={() =>
            timeRemaining === "입장"
              ? nav(`/classwaiting/${classInfo.uuid}`, {
                  state: {
                    classData: classInfo,
                    isHost:
                      location.pathname === "/mypage/teach" ? true : false,
                  },
                })
              : ""
          }
          // className="size-8"
        />
      </div>
    </div>
  );
};

export default Class;

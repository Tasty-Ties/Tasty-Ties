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

  let timeRemaing = "";
  if (days > 0) {
    timeRemaing += `D-${days}`;
  } else if (hours > 0) {
    timeRemaing += `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  } else {
    timeRemaing += "입장";
  }

  return (
    <div className="flex">
      <div>
        <img src={classInfo.mainImage} alt="클래스사진" />
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
      <Button
        text={timeRemaing}
        type={timeRemaing === "입장" ? "orange-sqr" : "gray-sqr"}
        onClick={() =>
          timeRemaing === "입장"
            ? nav(`/classwaiting/${classInfo.uuid}`, {
                state: {
                  classData: classInfo,
                  isHost: location.pathname === "/mypage/teach" ? true : false,
                },
              })
            : ""
        }
      />
    </div>
  );
};

export default Class;

import "../../styles/MyPage/Class.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Button from "./Button";

const Class = ({ classInfo }) => {
  //   //   const timeRemaining = endTime.getHours();
  //   //   console.log(timeRemaining);
  //   //   console.log(endTime);
  //   let nowdate = new Date();
  //   let startdate = new Date(startTime);
  //   //   console.log(startdate);
  //   //   console.log(startdate.getTime());
  //   //   const timeRemaingTimestamp = startdate.getTime() - nowdate.getTime();
  //   const timeRemaing = startdate - nowdate;
  //   console.log(timeRemaing);
  //   let timeRemaingDate = new Date(timeRemaing);
  //   console.log(timeRemaingDate);

  //   //   const timeRemaingMonth = startdate.getMonth() - nowdate.getMonth(); // 남은 월
  //   //   const timeRemainingDate = startdate.getDate() - nowdate.getDate(); //남은 일자
  //   //   const timeRemainingHour = startdate.getHours() - nowdate.getHours(); // 남은 시간
  //   //   const timeRemainingMinute = startdate.getMinutes() - nowdate.getMinutes(); //남은 분
  //   //   const timeRemainingSecond = startdate.getSeconds() - nowdate.getSeconds(); //남은 초

  //   //   let timeRemaing = "";
  //   //   if (timeRemaingMonth > 0 || timeRemainingDate > 0) {
  //   //     timeRemaing += `D-${timeRemainingDate}`;
  //   //   } else if (timeRemainingHour > 0) {
  //   //     timeRemaing += `${timeRemainingHour}:${timeRemainingMinute}`;
  //   //   } else {
  //   //     timeRemaing += "입장";
  //   //   }
  //   //   console.log(
  //   //     timeRemaingMonth,
  //   //     timeRemainingDate,
  //   //     timeRemainingHour,
  //   //     timeRemainingMinute,
  //   //     timeRemainingSecond
  //   //   );
  //   //   console.log(timeRemaing);
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

  // 결과 출력
  console.log(`남은 시간: ${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);

  const nav = useNavigate();
  const location = useLocation();

  console.log(location.pathname);

  return (
    <div className="flex">
      <div>
        <div className="flex">
          <img src={classInfo.mainImage} alt="클래스사진" />
        </div>
        <h3>{classInfo.title}</h3>
        <p>
          강의시간: {classInfo.startTime} ~ {classInfo.endTime}
        </p>
        <Link to="">상세 보기</Link>
      </div>
      <Button
        text="입장"
        type={"orange-sqr"}
        onClick={() =>
          nav(`/classwaiting/${classInfo.uuid}`, {
            state: {
              classData: classInfo,
              isHost: location.pathname === "/mypage/teach" ? true : false,
            },
          })
        }
      />
    </div>
  );
};

export default Class;

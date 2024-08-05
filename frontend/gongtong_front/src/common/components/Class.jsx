import "../../styles/MyPage/Class.css";
import { Link } from "react-router-dom";
import Button from "./Button";

const Class = ({ title, mainImage, startTime, endTime, hostName }) => {
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

  // startTime 설정
  let startdate = new Date(startTime);

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

  let timeRemaing = "";
  if (days > 0) {
    timeRemaing += `D-${days}`;
  } else if (hours > 0) {
    timeRemaing += `${hours}:${minutes}`;
  } else {
    timeRemaing += "입장";
  }
  console.log(days, hours, minutes, seconds);
  console.log(timeRemaing);

  return (
    <div className="flex">
      <div>
        <img src={mainImage} alt="클래스사진" />
      </div>
      <div>
        <h3>{title}</h3>
        <p>
          강의시간: {startTime} ~ {endTime}
        </p>
        <Link to="">상세 보기</Link>
      </div>
      <Button text={timeRemaing} type={"orange-sqr"} />
    </div>
  );
};

export default Class;

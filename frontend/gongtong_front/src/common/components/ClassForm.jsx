import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";

const ClassForm = ({ classInfo, classType }) => {
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

  let timeRemaining = "";
  if (days > 0) {
    timeRemaining += `D-${days}`;
  } else if (hours > 0) {
    timeRemaining += `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  } else {
    timeRemaining += "입장";
  }

  let buttonText = "";
  let buttonType = "";

  if (classType === "attend") {
    let replayEndTime = new Date(classInfo.replayEndTime);
    if (replayEndTime > now) {
      buttonText = "다시보기";
      buttonType = "orange-border-sqr";
    } else {
      buttonText = "기간만료";
      buttonType = "gray-sqr";
    }
  } else {
    buttonText = timeRemaining;
    buttonType = timeRemaining === "입장" ? "orange-sqr" : "gray-sqr";
  }

  const handleButtonClick = () => {
    if (classType === "attend" && buttonText === "다시보기") {
      nav(`/classreplay/${classInfo.uuid}`);
    } else if (buttonText === "입장") {
      nav(`/classwaiting/${classInfo.uuid}`, {
        state: {
          classData: classInfo,
          isHost: location.pathname === "/mypage/teach",
        },
      });
    }
  };

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
          text={buttonText}
          type={buttonType}
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
};

export default ClassForm;

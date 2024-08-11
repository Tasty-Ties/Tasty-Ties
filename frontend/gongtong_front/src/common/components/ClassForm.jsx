import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import CountryFlags from "./CountryFlags";

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
      buttonType = "replay-button";
    } else {
      buttonText = "기간만료";
      buttonType = "expired-button";
    }
  } else {
    buttonText = timeRemaining;
    buttonType = timeRemaining === "입장" ? "enter-button" : "time-button";
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
      <div className="flex">
        <div className="relative overflow-hidden rounded-lg">
          <div>
            <img
              src={classInfo.mainImage}
              alt="클래스사진"
              className="w-40 h-20 object-cover"
            />
          </div>
          <span className="absolute right-1 top-1">
            <CountryFlags
              countryCode={classInfo.classCountry.alpha2}
              size="w-5"
            />
          </span>
        </div>
        <div className="ml-6 w-72">
          <p className="font-bold mb-2 truncate">{classInfo.title}</p>
          <div className="flex">
            <p className="text-xs">{date}</p>&nbsp;
            <p className="text-xs">
              {startTime}~{endTime}
            </p>
          </div>
          <button
            className="font-bold text-xs text-first"
            onClick={() => nav(`/class/${classInfo.uuid}`)}
          >
            상세 보기 {">"}
          </button>
        </div>
      </div>
      <div className="m-3 mr-3">
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

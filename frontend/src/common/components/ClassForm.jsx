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

  if (classType !== "attend") {
    buttonText = timeRemaining;
    buttonType = timeRemaining === "입장" ? "enter-button" : "time-button";
  }

  const handleButtonClick = () => {
    if (buttonText === "입장") {
      nav(`/classwaiting/${classInfo.uuid}`, {
        state: {
          classId: classInfo.uuid,
          isHost: location.pathname === "/mypage/teach",
        },
      });
    }
  };

  return (
    <div className="flex" style={{ height: "100px" }}>
      <div className="flex">
        <div className="relative">
          <div className="">
            <img
              src={classInfo.mainImage}
              alt="클래스사진"
              className="h-24 w-44 rounded-lg object-center object-cover"
            />
          </div>
          <span className="absolute right-1 top-1">
            <CountryFlags
              countryCode={classInfo.classCountry.alpha2}
              size="w-5"
            />
          </span>
        </div>
        <div className="ml-6 w-56">
          <p className="font-bold text-lg mb-2 truncate">{classInfo.title}</p>
          <div className="flex">
            <p className="text-sm">{date}</p>&nbsp;
            <p className="text-sm">
              {startTime}~{endTime}
            </p>
          </div>
          <button
            className="font-bold text-sm text-first"
            onClick={() => nav(`/class/${classInfo.uuid}`)}
          >
            상세 보기 {">"}
          </button>
        </div>
      </div>
      <div className="m-3 mr-3">
        {classType !== "attend" ? (
          <Button
            text={buttonText}
            type={buttonType}
            onClick={handleButtonClick}
          />
        ) : (
          <div className="w-16"></div>
        )}
      </div>
    </div>
  );
};

export default ClassForm;

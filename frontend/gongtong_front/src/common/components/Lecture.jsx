import { useParams } from "react-router-dom";
import CountryFlags from "./CountryFlags";

const Lecture = ({ classInfo }) => {
  const { username } = useParams();
  console.log(username);
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

  return (
    <div className="flex flex-col">
      <div className="relative">
        <img
          src={classInfo.mainImage}
          alt="클래스메인사진"
          className="w-60 h-40 rounded-xl"
        />
        <span className="absolute right-1 top-1">
          <CountryFlags
            countryCode={classInfo.classCountry.alpha2}
            size="w-7"
          />
        </span>
      </div>

      <div className="font-bold text-base mt-4">{classInfo.title}</div>
      <div className="flex space-x-5 text-sm my-2">
        <div className="text-xs">
          {date} {startTime}~{endTime}
        </div>
        <p className="text-xs">{classInfo.hostName}</p>
      </div>
    </div>
  );
};
export default Lecture;

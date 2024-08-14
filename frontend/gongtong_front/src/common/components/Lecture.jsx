import { useParams } from "react-router-dom";
import CountryFlags from "./CountryFlags";
import { useNavigate } from "react-router-dom";

const Lecture = ({ classInfo }) => {
  const nav = useNavigate();
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
      <div
        className="cursor-pointer"
        onClick={() => nav(`/class/${classInfo.uuid}`)}
      >
        <div className="relative overflow-hidden">
          <img
            src={classInfo.mainImage}
            alt="클래스메인사진"
            className="w-52 h-32 object-cover rounded-xl"
          />
          <span className="absolute right-1 top-1">
            <CountryFlags
              countryCode={classInfo.classCountry.alpha2}
              size="w-7"
            />
          </span>
        </div>

        <div className="font-bold text-lg mt-4 truncate">{classInfo.title}</div>
        <div className="flex-auto text-sm my-2">
          <div>
            {date} {startTime}~{endTime}
          </div>
          <p>{classInfo.hostName}</p>
        </div>
      </div>
    </div>
  );
};
export default Lecture;

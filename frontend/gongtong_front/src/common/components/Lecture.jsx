import { useParams } from "react-router-dom";

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
      <p>
        <img src={classInfo.mainImage} alt="클래스메인사진" />
        {classInfo.classCountry.alpha2}
      </p>
      <p>{classInfo.title}</p>
      <div className="flex">
        <p>
          강의 일자:{date} {startTime}~{endTime}
        </p>
        <p>{classInfo.hostName}</p>
      </div>
    </div>
  );
};
export default Lecture;

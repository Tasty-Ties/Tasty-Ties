import useProfileStore from "../../store/ProfileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Lecture from "../../common/components/Lecture";

const AttendClass = () => {
  const { username } = useParams();
  const attendedClasses = useProfileStore((state) => state.attendedClasses);
  const fetchAttendedClasses = useProfileStore(
    (state) => state.fetchAttendedClasses
  );

  useEffect(() => {
    fetchAttendedClasses(username);
  }, []);
  console.log(attendedClasses);

  return (
    <div>
      <div className="flex">
        <p className="text-xl mr-2">참여한 클래스</p>
        <p className="text-sm mt-1">전체</p>
        <p className="text-xs mt-2 ml-1">{attendedClasses.totalElements}</p>
      </div>
      {attendedClasses.content?.map((attendClass, index) => (
        <Lecture key={index} classInfo={attendClass} />
      ))}
    </div>
  );
};
export default AttendClass;

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
        <p className="text-2xl mr-2">참여한 클래스</p>
        <p className="text-sm mt-2">전체</p>
        <p className="text-xs text-first mt-3 ml-1">
          {attendedClasses.totalElements}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-4 gap-3">
        {attendedClasses.content?.map((attendClass, index) => (
          <Lecture key={index} classInfo={attendClass} />
        ))}
      </div>
    </div>
  );
};
export default AttendClass;

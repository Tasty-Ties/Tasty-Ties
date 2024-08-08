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
    <>
      <div>참여한 클래스</div>
      <p>전체</p>
      <p>{attendedClasses.totalElements}</p>
      {attendedClasses.content?.map((attendClass, index) => (
        <Lecture key={index} classInfo={attendClass} />
      ))}
    </>
  );
};
export default AttendClass;

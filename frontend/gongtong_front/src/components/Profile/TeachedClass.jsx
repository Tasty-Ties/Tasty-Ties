import useProfileStore from "../../store/ProfileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Lecture from "../../common/components/Lecture";

const TeachedClass = () => {
  const { username } = useParams();
  const teachedClasses = useProfileStore((state) => state.teachedClasses);
  const fetchTeachedClasses = useProfileStore(
    (state) => state.fetchTeachedClasses
  );

  useEffect(() => {
    fetchTeachedClasses(username);
  }, []);
  console.log(teachedClasses);
  return (
    <>
      <div>수업한 클래스</div>
      <p>전체</p>
      <p>{teachedClasses.totalElements}</p>
      {teachedClasses.content?.map((attendClass, index) => (
        <Lecture key={index} classInfo={attendClass} />
      ))}
    </>
  );
};
export default TeachedClass;

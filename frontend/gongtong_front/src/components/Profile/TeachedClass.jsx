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
    <div>
      <p className="text-xl">수업한 클래스</p>
      <div className="flex">
        <p className="text-sm">전체</p>
        <p className="text-xs">{teachedClasses.totalElements}</p>
      </div>
      {teachedClasses.content?.map((attendClass, index) => (
        <Lecture key={index} classInfo={attendClass} />
      ))}
    </div>
  );
};
export default TeachedClass;

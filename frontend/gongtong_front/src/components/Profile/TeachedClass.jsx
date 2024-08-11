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
      <div className="flex">
        <p className="text-xl mr-2">진행한 클래스</p>
        <p className="text-sm mt-1">전체</p>
        <p className="text-xs text-first mt-2 ml-1">
          {teachedClasses.totalElements}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-4 gap-6">
        {teachedClasses.content?.map((attendClass, index) => (
          <Lecture key={index} classInfo={attendClass} />
        ))}
      </div>
    </div>
  );
};
export default TeachedClass;

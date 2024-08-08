import useProfileStore from "../../store/ProfileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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
      <div>참여한 클래스</div>
    </>
  );
};
export default TeachedClass;

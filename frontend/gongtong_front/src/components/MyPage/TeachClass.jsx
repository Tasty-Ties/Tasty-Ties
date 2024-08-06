import React, { useEffect } from "react";
import useMyPageStore from "../../store/MyPageStore";
import Class from "../../common/components/Class";

const TeachClass = () => {
  const teachClasses = useMyPageStore((state) => state.teachClasses);
  const fetchTeachClasses = useMyPageStore((state) => state.fetchTeachClasses);

  useEffect(() => {
    fetchTeachClasses();
    console.log(teachClasses);
  }, []);
  console.log(teachClasses);

  if (teachClasses.length === 0) {
    return <div>수업할 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p>수업할 클래스</p>
      {teachClasses.map((teachClass, index) => (
        <Class key={index} classInfo={teachClass} />
      ))}
    </div>
  );
};

export default TeachClass;

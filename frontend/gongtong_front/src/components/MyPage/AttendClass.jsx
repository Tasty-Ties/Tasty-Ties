import React, { useEffect } from "react";
import useMyPageStore from "../../store/MyPageStore";
import ClassForm from "../../common/components/ClassForm";

const AttendClass = () => {
  const attendClasses = useMyPageStore((state) => state.attendClasses);
  const fetchAttendClasses = useMyPageStore(
    (state) => state.fetchAttendClasses
  );

  useEffect(() => {
    fetchAttendClasses();
    console.log(attendClasses);
  }, []);
  console.log(attendClasses);

  if (attendClasses.length === 0) {
    return <div className="text-xl">참여한 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p className="text-xl">참여한 클래스</p>
      {attendClasses.map((attendClass, index) => (
        <ClassForm key={index} classInfo={attendClass} />
      ))}
    </div>
  );
};
export default AttendClass;

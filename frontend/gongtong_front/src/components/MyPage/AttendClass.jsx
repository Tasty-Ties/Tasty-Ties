import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useMyPageStore from "../../store/MyPageStore";
import ClassForm from "../../common/components/ClassForm";
import Pagination from "../../common/components/Pagination";

const AttendClass = () => {
  const attendClasses = useMyPageStore((state) => state.attendClasses);
  const fetchAttendClasses = useMyPageStore(
    (state) => state.fetchAttendClasses
  );
  const totalItems = useMyPageStore((state) => state.totalItems);

  const location = useLocation();

  const itemCountPerPage = 4;
  const pageCount = 5;

  // 쿼리 파라미터에서 페이지 정보 가져오기
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchAttendClasses(currentPage, itemCountPerPage);
    console.log(attendClasses);
  }, [currentPage]);
  console.log(attendClasses);

  if (attendClasses.length === 0) {
    return <div className="text-xl">참여한 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p className="text-xl">참여한 클래스</p>
      {attendClasses.map((attendClass, index) => (
        <ClassForm key={index} classInfo={attendClass} classType="attend" />
      ))}
      <Pagination
        totalItems={totalItems}
        itemCountPerPage={itemCountPerPage}
        pageCount={5}
        currentPage={currentPage}
      />
    </div>
  );
};
export default AttendClass;

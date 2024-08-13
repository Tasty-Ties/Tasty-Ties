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
      <p className="font-bold text-2xl mb-3">참여한 클래스</p>
      <div className="grid grid-rows-4 gap-3">
        {attendClasses.map((attendClass, index) => (
          <ClassForm key={index} classInfo={attendClass} classType="attend" />
        ))}
      </div>
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
        <Pagination
          totalItems={totalItems}
          itemCountPerPage={itemCountPerPage}
          pageCount={pageCount}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};
export default AttendClass;

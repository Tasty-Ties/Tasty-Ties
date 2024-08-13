import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useMyPageStore from "../../store/MyPageStore";
import ClassForm from "../../common/components/ClassForm";
import Pagination from "../../common/components/Pagination";

const ReserveClass = () => {
  const reserveClasses = useMyPageStore((state) => state.reserveClasses);
  const fetchReserveClasses = useMyPageStore(
    (state) => state.fetchReserveClasses
  );
  const totalItems = useMyPageStore((state) => state.totalItems);

  const location = useLocation();

  const itemCountPerPage = 4;
  const pageCount = 5;

  // 쿼리 파라미터에서 페이지 정보 가져오기
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchReserveClasses(currentPage, itemCountPerPage);
    console.log(reserveClasses);
  }, [currentPage]);

  if (reserveClasses.length === 0) {
    return <div className="text-xl">예약한 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p className="font-bold text-2xl mb-3">예약한 클래스</p>
      <div className="grid grid-rows-4 gap-3">
        {reserveClasses.map((reserveClasses, index) => (
          <ClassForm
            key={index}
            classInfo={reserveClasses}
            classType="reserve"
          />
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
export default ReserveClass;

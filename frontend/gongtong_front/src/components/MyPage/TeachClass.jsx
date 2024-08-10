import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useMyPageStore from "../../store/MyPageStore";
import ClassForm from "../../common/components/ClassForm";
import Pagination from "../../common/components/Pagination";

const TeachClass = () => {
  const teachClasses = useMyPageStore((state) => state.teachClasses);
  const fetchTeachClasses = useMyPageStore((state) => state.fetchTeachClasses);
  const totalItems = useMyPageStore((state) => state.totalItems);

  const location = useLocation();

  const itemCountPerPage = 4;
  const pageCount = 5;

  // 쿼리 파라미터에서 페이지 정보 가져오기
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchTeachClasses(currentPage, itemCountPerPage);
    console.log(teachClasses);
  }, [currentPage]);

  if (teachClasses.length === 0) {
    return <div className="text-xl">수업할 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p className="text-xl">수업할 클래스</p>
      {teachClasses.map((teachClass, index) => (
        <ClassForm key={index} classInfo={teachClass} classType="teach" />
      ))}
      <Pagination
        totalItems={totalItems}
        itemCountPerPage={itemCountPerPage}
        pageCount={pageCount}
        currentPage={currentPage}
      />
    </div>
  );
};

export default TeachClass;

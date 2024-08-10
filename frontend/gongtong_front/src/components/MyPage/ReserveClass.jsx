import { useEffect } from "react";
import useMyPageStore from "../../store/MyPageStore";
import ClassForm from "../../common/components/ClassForm";

const ReserveClass = () => {
  const reserveClasses = useMyPageStore((state) => state.reserveClasses);
  const fetchReserveClasses = useMyPageStore(
    (state) => state.fetchReserveClasses
  );

  useEffect(() => {
    fetchReserveClasses();
    console.log(reserveClasses);
  }, []);

  if (reserveClasses.length === 0) {
    return <div className="text-xl">예약한 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p>예약한 클래스</p>
      {reserveClasses.map((reserveClasses, index) => (
        <ClassForm key={index} classInfo={reserveClasses} />
      ))}
    </div>
  );
};
export default ReserveClass;

import { useEffect } from "react";
import useMyPageStore from "../../store/MyPageStore";
import Class from "../../common/components/Class";

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
    return <div>예약한 클래스가 없습니다.</div>;
  }

  return (
    <div>
      <p>예약한 클래스</p>
      {reserveClasses.map((reserveClasses, index) => (
        <Class key={index} classInfo={reserveClasses} />
      ))}
    </div>
  );
};
export default ReserveClass;

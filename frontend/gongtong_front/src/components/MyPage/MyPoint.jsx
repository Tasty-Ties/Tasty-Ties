import useMyPageStore from "../../store/MyPageStore";
import { useEffect, useState } from "react";
import PointTable from "./MyPoint/PointTable";

const MyPoint = () => {
  const mileageLogs = useMyPageStore((state) => state.mileageLogs);
  const fetchMileageLogs = useMyPageStore((state) => state.fetchMileageLogs);
  const [month, setMonth] = useState(1); // 기본 1개월

  useEffect(() => {
    fetchMileageLogs(month);
  }, [month]);
  console.log(mileageLogs);

  return (
    <div>
      <div className="font-bold text-xl mb-3">마일리지</div>
      <div>
        <button onClick={() => setMonth(1)}>1개월</button>
        <button onClick={() => setMonth(3)}>3개월</button>
        <button onClick={() => setMonth(6)}>6개월</button>
        <button onClick={() => setMonth(12)}>12개월</button>
      </div>
      <PointTable log={mileageLogs} />
    </div>
  );
};
export default MyPoint;

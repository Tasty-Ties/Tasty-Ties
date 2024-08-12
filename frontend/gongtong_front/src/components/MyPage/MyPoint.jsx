import useMyPageStore from "../../store/MyPageStore";
import { useEffect, useState } from "react";
import PointTable from "./MyPoint/PointTable";

const MyPoint = () => {
  const mileageLogs = useMyPageStore((state) => state.mileageLogs);
  const fetchMileageLogs = useMyPageStore((state) => state.fetchMileageLogs);
  const [month, setMonth] = useState(1); // 기본 1개월
  const monthArr = [1, 3, 6, 12];

  useEffect(() => {
    fetchMileageLogs(month);
  }, [month]);
  console.log(mileageLogs);

  return (
    <div>
      <div className="font-bold text-xl mb-3">마일리지</div>
      <div>
        {monthArr.map((month, index) => (
          <button key={index} onClick={() => setMonth(month)}>
            {month}개월
          </button>
        ))}
      </div>
      <PointTable log={mileageLogs} />
    </div>
  );
};
export default MyPoint;

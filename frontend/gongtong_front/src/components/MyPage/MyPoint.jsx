import useMyPageStore from "../../store/MyPageStore";
import { useEffect, useState } from "react";
import PointTable from "./MyPoint/PointTable";
import Button from "../../common/components/Button";

const MyPoint = () => {
  const mileageLogs = useMyPageStore((state) => state.mileageLogs);
  const fetchMileageLogs = useMyPageStore((state) => state.fetchMileageLogs);
  const [month, setMonth] = useState(1); // 기본 1개월
  const [clickedMonth, setClickedMonth] = useState(1);
  const monthArr = [1, 3, 6, 12];

  useEffect(() => {
    fetchMileageLogs(month);
  }, [month]);

  return (
    <div>
      <div className="font-bold text-2xl">마일리지</div>
      <br />
      <div className="flex w-max flex-row gap-4">
        {monthArr.map((month, index) => (
          <Button
            key={index}
            onClick={() => {
              setMonth(month);
              setClickedMonth(month);
            }}
            text={`${month}개월`}
            type={clickedMonth === month ? "click-month-group" : "month-group"}
          />
        ))}
      </div>
      <br />

      <PointTable log={mileageLogs} />
    </div>
  );
};
export default MyPoint;

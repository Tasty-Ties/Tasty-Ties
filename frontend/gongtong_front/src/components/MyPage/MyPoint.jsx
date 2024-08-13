import useMyPageStore from "../../store/MyPageStore";
import { useEffect, useState } from "react";
import PointTable from "./MyPoint/PointTable";
import { ButtonGroup, Button } from "@material-tailwind/react";

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
      <div className="font-bold text-2xl mb-3">마일리지</div>
      <div className="flex w-max flex-col gap-4">
        <ButtonGroup variant="text">
          {monthArr.map((month, index) => (
            <Button key={index} onClick={() => setMonth(month)}>
              {month}개월
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <PointTable log={mileageLogs} />
    </div>
  );
};
export default MyPoint;

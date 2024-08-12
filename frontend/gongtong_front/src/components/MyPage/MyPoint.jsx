import { set } from "react-hook-form";
import useMyPageStore from "../../store/MyPageStore";
import { useEffect, useState } from "react";

const MyPoint = () => {
  const mileageLogs = useMyPageStore((state) => state.mileageLogs);
  const fetchMileageLogs = useMyPageStore((state) => state.fetchMileageLogs);
  const [month, setMonth] = useState(0);

  useEffect(() => {
    setMonth(1);
    fetchMileageLogs(month);
    console.log(mileageLogs);
  }, [month]);

  return (
    <div>
      <div>마일리지</div>
      <div>
        <p>
          <button onClick={() => setMonth(1)}>1개월</button>
        </p>
        <p>
          <button onClick={() => setMonth(3)}>3개월</button>
        </p>
        <p>
          <button onClick={() => setMonth(6)}>6개월</button>
        </p>
        <p>
          <button onClick={() => setMonth(12)}>12개월</button>
        </p>
      </div>
    </div>
  );
};
export default MyPoint;

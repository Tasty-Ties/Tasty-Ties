import { useNavigate } from "react-router-dom";
import Button from "../../common/components/Button";

const ReserveList = ({ data }) => {
  const nav = useNavigate();
  console.log(data);
  return (
    <>
      <div className="border-solid border-2">
        <div>{data.title}</div>
        <div>{data.hostName}</div>
        <div>{data.uuid}</div>
        <Button
          text="참가자로 클래스 입장"
          type={"green-short"}
          onClick={() =>
            nav("/classwaiting", { state: { classData: data, isHost: false } })
          }
        />
      </div>
    </>
  );
};

export default ReserveList;

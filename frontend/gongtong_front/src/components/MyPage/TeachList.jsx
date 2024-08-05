import { useNavigate } from "react-router-dom";
import Button from "../../common/components/Button";

const TeachList = ({ data }) => {
  const nav = useNavigate();
  console.log(data);
  return (
    <>
      <div className="border-solid border-2">
        <div>{data.title}</div>
        <div>{data.hostName}</div>
        <div>{data.uuid}</div>
        <Button
          text="호스트로 클래스 입장"
          type={"green-short"}
          onClick={() =>
            nav(`/classwaiting/${data.uuid}`, {
              state: { classData: data, isHost: true },
            })
          }
        />
      </div>
    </>
  );
};

export default TeachList;

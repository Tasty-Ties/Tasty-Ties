import Check from "../../assets/완료.png";
import Button from "../../common/components/Button";
import { useLocation, useNavigate } from "react-router-dom";

const RegistClassComplete = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { message, classTitle, classTime } = location.state || {};
  return (
    <div className="flex flex-col items-center justify-center text-center mt-28">
      <img src={Check} alt="완료표시" className="size-36 mb-6" />
      <div className="mb-5">
        <p className="font-bold text-xl mb-8">{message}</p>
        <p className="text-lg text-first">{classTitle}</p>
        <p className="text-lg text-first">{classTime}</p>
      </div>
      <Button
        text="강의 목록 페이지로 이동"
        type="green-long"
        onClick={() => nav("/class")}
      />
    </div>
  );
};
export default RegistClassComplete;

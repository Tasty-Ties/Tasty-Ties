import Check from "../../assets/완료.png";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Complete = ({ message, classTitle, classTime }) => {
  const nav = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center mt-28">
      <img src={Check} alt="완료표시" className="size-36 mb-16" />
      <p className="font-bold text-xl mb-8">{message}</p>
      <p className="text-lg text-first">{classTitle}</p>
      <p className="text-lg text-first">{classTime}</p>
      <Button text="메인으로 이동" type="green-long" onClick={() => nav("/")} />
    </div>
  );
};
export default Complete;

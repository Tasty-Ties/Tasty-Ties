import { useNavigate } from "react-router-dom";
const ToolbarComponent = ({ leaveSession }) => {
  const nav = useNavigate();

  return (
    <button
      onClick={() => {
        leaveSession();
        nav("/");
      }}
    >
      나가기
    </button>
  );
};

export default ToolbarComponent;

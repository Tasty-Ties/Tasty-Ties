import { useNavigate } from "react-router-dom";
import Button from "../../common/components/Button";
const ToolbarComponent = ({
  displayMode,
  captureOpen,
  peopleListOpen,
  chatOpen,
  leaveSession,
}) => {
  const nav = useNavigate();

  return (
    <>
      <div>
        <Button type={"green-short"} text="디스플레이" onClick={displayMode} />
        <Button type={"green-short"} text="기념사진" onClick={captureOpen} />
        <Button type={"green-short"} text="참가자" onClick={peopleListOpen} />
        <Button type={"green-short"} text="대화" onClick={chatOpen} />
        <Button
          type={"green-short"}
          text="나가기"
          onClick={() => {
            leaveSession();
            nav("/");
          }}
        />
      </div>
    </>
  );
};

export default ToolbarComponent;

import { useNavigate } from "react-router-dom";
import useProfileStore from "../../store/ProfileStore";

const OtherInfo = () => {
  const nav = useNavigate();
  const informations = useProfileStore((state) => state.informations);
  return (
    <>
      <p>수집한 국기</p>

      <br />
      <p>진행한 클래스</p>
    </>
  );
};

export default OtherInfo;

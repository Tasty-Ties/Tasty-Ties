import { useNavigate, useOutletContext } from "react-router-dom";
import useProfileStore from "../../store/ProfileStore";
import CountryFlags from "../../common/components/CountryFlags";
import Lecture from "../../common/components/Lecture";

const OtherInfo = () => {
  const nav = useNavigate();
  const { informations } = useOutletContext();
  // const informations = useProfileStore((state) => state.otherInformations);

  return (
    <>
      {informations && (
        <div>
          <p>수집한 국기</p>
          <div className="flex">
            {informations.informations.userProfileDto?.collectedFlags.map(
              (flag, index) => (
                <CountryFlags
                  key={index}
                  countryCode={flag.countryCode}
                  size="w-7"
                />
              )
            )}
          </div>
          <br />
          <p>진행한 클래스</p>
          <Lecture />
          <p></p>
        </div>
      )}
    </>
  );
};

export default OtherInfo;

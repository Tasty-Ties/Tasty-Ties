import { useNavigate, useOutletContext } from "react-router-dom";
import CountryFlags from "../../common/components/CountryFlags";
import Lecture from "../../common/components/Lecture";
import Button from "../../common/components/Button";

const OtherInfo = () => {
  const nav = useNavigate();
  const { informations } = useOutletContext();
  const username = informations.informations.userProfileDto.nickname;

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
          <div className="flex">
            {informations.informations.hostingClasses?.map(
              (teachClass, index) => (
                <Lecture key={index} classInfo={teachClass} />
              )
            )}
          </div>
          <Button
            text="더보기"
            type="green-border-short"
            onClick={() => nav(`/otherpage/:${username}/teach`)}
          />
          <br />
          <br />
          <br />
          <p>참여한 클래스</p>
          <div>
            {informations.informations.reservedClasses?.map(
              (attendClass, index) => (
                <Lecture key={index} classInfo={attendClass} />
              )
            )}
          </div>
          <Button
            text="더보기"
            type="green-border-short"
            onClick={() => nav(`/otherpage/:${username}/attend`)}
          />
        </div>
      )}
    </>
  );
};

export default OtherInfo;

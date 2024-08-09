import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CountryFlags from "../../common/components/CountryFlags";
import Lecture from "../../common/components/Lecture";
import Button from "../../common/components/Button";
import ReviewForm from "../../common/components/ReviewForm";

const OtherInfo = () => {
  const nav = useNavigate();
  const { informations } = useOutletContext();
  const { username } = useParams();
  console.log(username);
  console.log(informations.informations.reviews);

  return (
    <div>
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
            onClick={() => nav(`/otherpage/${username}/teach`)}
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
            onClick={() => nav(`/otherpage/${username}/attend`)}
          />
          <p>수강평</p>
          <div>
            {informations.informations.reviews?.map((review, index) => (
              <ReviewForm key={index} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherInfo;

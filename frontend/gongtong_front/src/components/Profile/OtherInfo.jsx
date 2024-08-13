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
          <p className="text-2xl mb-2">수집한 국기</p>
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
          <br />
          <p className="text-2xl mb-2">진행한 클래스</p>
          <div className="grid grid-cols-4 space-x-3">
            {informations.informations.hostingClasses?.map(
              (teachClass, index) => (
                <Lecture key={index} classInfo={teachClass} />
              )
            )}
          </div>
          <div className="flex justify-center mt-2">
            <Button
              text="더보기"
              type="view-more"
              onClick={() => nav(`/otherpage/${username}/teach`)}
            />
          </div>
          <br />
          <br />
          <br />
          <p className="text-2xl mb-2">참여한 클래스</p>
          <div className="grid grid-cols-4 space-x-3">
            {informations.informations.reservedClasses?.map(
              (attendClass, index) => (
                <Lecture key={index} classInfo={attendClass} />
              )
            )}
          </div>
          <div className="flex justify-center mt-2">
            <Button
              text="더보기"
              type="view-more"
              onClick={() => nav(`/otherpage/${username}/attend`)}
            />
          </div>
          <br />
          <br />
          <br />
          <p className="text-2xl mb-2">수강평</p>
          <div className="grid grid-rows-3 gap-3">
            {informations.informations.reviews?.map((review, index) => (
              <ReviewForm key={index} review={review} />
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <Button
              text="더보기"
              type="view-more"
              onClick={() => nav(`/otherpage/${username}/review`)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherInfo;

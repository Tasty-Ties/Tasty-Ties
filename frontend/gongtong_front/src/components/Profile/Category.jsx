import { NavLink, Outlet } from "react-router-dom";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";

const Category = (informations) => {
  const information = informations.informations;
  console.log(information);

  return (
    <div className="flex">
      <div>
        {information.userProfileDto && (
          <div>
            <p>
              프로필사진:
              <img
                src={information.userProfileDto.profileImageUrl}
                alt="프로필사진"
              />
            </p>
            <p>
              국적:
              {information.userProfileDto.country.koreanName}
            </p>
            <p>이름:{information.userProfileDto.nickname}</p>
            <p>자기소개:{information.userProfileDto.description}</p>
            <div className="flex">
              <p className="flex">
                <img src={instalogo} alt="인스타로고" /> :
                {information.userProfileDto.instagramHandle}
              </p>
              <p className="flex">
                <img src={youtubelogo} alt="유튜브로고" /> :
                {information.userProfileDto.youtubeHandle}
              </p>
            </div>
          </div>
        )}
        <br />
        <hr />
        <ul>
          <li>
            <NavLink to="">홈</NavLink>
          </li>
          <li>
            <NavLink to="teach">수업한 클래스</NavLink>
          </li>
          <li>
            <NavLink to="attend">참여한 클래스</NavLink>
          </li>
          <li>
            <NavLink to="review">수강평</NavLink>
          </li>
        </ul>
        <br />
      </div>
      <div>
        <Outlet
          context={{
            informations: informations,
            // teachClass: informations.hostingClasses,
            // attendClass: informations.reservedClasses,
            // review: informations.reviews,
          }}
        />
      </div>
    </div>
  );
};

export default Category;

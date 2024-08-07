import { NavLink, Outlet } from "react-router-dom";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";

const Category = (informations) => {
  const userProfileDto = informations.informations.userProfileDto;

  return (
    <div className="flex">
      <div>
        {userProfileDto && (
          <div>
            <p>
              프로필사진:{" "}
              <img src="userProfileDto.profileImageUrl" alt="프로필사진" />
            </p>
            <p>
              국적:
              {userProfileDto.country.koreanName}
            </p>
            <p>이름:{userProfileDto.nickname}</p>
            <p>자기소개:{userProfileDto.description}</p>
            <div className="flex">
              <p className="flex">
                <img src={instalogo} alt="인스타로고" /> :
                {userProfileDto.instagramHandle}
              </p>
              <p className="flex">
                <img src={youtubelogo} alt="유튜브로고" /> :
                {userProfileDto.youtubeHandle}
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
        <Outlet />
      </div>
    </div>
  );
};

export default Category;

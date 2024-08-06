import { NavLink, Outlet } from "react-router-dom";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import useProfileStore from "../../store/ProfileStore";

const Category = () => {
  const informations = useProfileStore((state) => state.otherInformations);
  return (
    <>
      <div>
        <br />
        <div>
          <p>프로필사진</p>
          <p>국적:{informations.country?.koreanName || "국적 정보 없음"}</p>
          <p>이름:{informations.nickname}</p>
          <p>자기소개:{informations.description}</p>
          <div className="flex">
            <p className="flex">
              <img src={instalogo} alt="인스타로고" /> :
            </p>
            <p className="flex">
              <img src={youtubelogo} alt="유튜브로고" /> :
            </p>
          </div>
        </div>
        <br />
        <hr />
        <ul>
          <li>
            <NavLink to="/mypage/reserve">홈</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/reserve">수업한 클래스</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/teach">참여한 클래스</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/attend">수강평</NavLink>
          </li>
        </ul>
        <br />
      </div>
    </>
  );
};

export default Category;

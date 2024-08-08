import { NavLink, Outlet } from "react-router-dom";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import useMyPageStore from "../../store/MyPageStore";

const Category = () => {
  const informations = useMyPageStore((state) => state.informations);
  return (
    <>
      <div>
        <br />
        <div>
          <p>
            <img
              src={informations.profileImageUrl}
              alt="내프로필사진"
              className="h-12 w-12 flex-none rounded-lg bg-gray-50"
            />
          </p>
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
          <li className="text-xl">클래스</li>
          <hr />
          <li>
            <NavLink to="/mypage/reserve">예약한 클래스</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/teach">수업할 클래스</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/attend">참여한 클래스</NavLink>
          </li>
        </ul>

        <br />
        <ul>
          <li className="text-xl">나의 활동</li>
          <hr />
          <li>
            <NavLink to="/mypage">내 정보</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/point">마일리지</NavLink>
          </li>
          <li>
            <NavLink to="/mypage/shorts">숏폼</NavLink>
          </li>
        </ul>
        <br />
      </div>
    </>
  );
};

export default Category;

import { Link } from "react-router-dom";
import useMyPageStore from "../../store/MyPageStore";
import { useEffect } from "react";
import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";

const Category = () => {
  const { informations, fetchInformations } = useMyPageStore();

  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);

  return (
    <>
      <div>
        <br />
        <div>
          <p>프로필사진</p>
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
        <ul>
          <li className="text-xl">클래스</li>
          <li>
            <Link to="">예약한 클래스</Link>
          </li>
          <li>
            <Link to="">수업할 클래스</Link>
          </li>
          <li>
            <Link to="">참여한 클래스</Link>
          </li>
        </ul>
        <br />
        <ul>
          <li className="text-xl">나의 활동</li>
          <li>
            <Link to="/mypage">내 정보</Link>
          </li>
          <li>
            <Link to="">마일리지</Link>
          </li>
          <li>
            <Link to="">숏폼</Link>
          </li>
        </ul>
        <br />
      </div>
    </>
  );
};

export default Category;

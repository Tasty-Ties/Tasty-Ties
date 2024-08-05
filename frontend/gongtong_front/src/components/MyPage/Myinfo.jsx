import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import Button from "../../common/components/Button";
import { deleteId } from "../../service/MyPageAPI";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useMyPageStore from "../../store/MyPageStore";

const MyInfo = () => {
  const informations = useMyPageStore((state) => state.informations);
  const nav = useNavigate();

  const handleDeleteId = () => {
    deleteId();
    nav("/");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.reload();
  };

  return (
    <div>
      <h1>내 정보</h1>
      <p>닉네임: {informations.nickname}</p>
      <p>국적: {informations.country?.koreanName || "국적 정보 없음"}</p>
      <p>모국어: {informations.language?.koreanName || "국적 정보 없음"}</p>
      <p>마일리지: {informations.activityPoint}</p>
      <p>이메일: {informations.email}</p>
      <p>생년월일: {informations.birth}</p>
      <p>수집한 국기: {informations.colletedFlags}</p>
      <p>SNS 연동 현황</p>
      <p>
        <img src={instalogo} alt="인스타로고" /> {informations.youtubeHandle}
      </p>
      <p>
        <img src={youtubelogo} alt="유튜브로고" />
        {informations.instagramHandle}
      </p>
      <br />
      <Button text="내정보 수정하기" type={"green-sqr"} />
      <Button text="회원탈퇴" type={"gray-sqr"} onClick={handleDeleteId} />
      <br /> <br /> <br /> <br /> <br /> <br /> <br />
    </div>
  );
};

export default MyInfo;

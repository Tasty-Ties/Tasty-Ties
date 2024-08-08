import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import Button from "../../common/components/Button";
import { deleteId } from "../../service/MyPageAPI";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useMyPageStore from "../../store/MyPageStore";
import { useEffect } from "react";

const MyInfo = () => {
  const nav = useNavigate();
  const informations = useMyPageStore((state) => state.informations);
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);

  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);

  const handleDeleteId = async () => {
    await deleteId();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    nav("/");
    window.location.reload();
  };

  return (
    <div>
      <h1>내 정보</h1>
      <p>닉네임: {informations.nickname}</p>
      <p>국적: {informations.country?.koreanName || "국적 정보 없음"}</p>
      <p>모국어: {informations.language?.koreanName || "모국어 정보 없음"}</p>
      <p>마일리지: {informations.activityPoint}</p>
      <p>이메일: {informations.email}</p>
      <p>생년월일: {informations.birth}</p>
      <p>수집한 국기: {informations.colletedFlags}</p>
      <p>SNS 연동 현황</p>
      <p className="flex">
        <img src={instalogo} alt="인스타로고" /> {informations.instagramHandle}
        <img src={youtubelogo} alt="유튜브로고" />
        {informations.youtubeHandle}
      </p>
      <br />
      <Button
        text="내정보 수정하기"
        type="green-sqr"
        onClick={() => nav("/mypage/editinfo", { state: { informations } })}
      />
      <Button text="회원탈퇴" type="gray-sqr" onClick={handleDeleteId} />
      <br /> <br /> <br /> <br /> <br /> <br /> <br />
    </div>
  );
};

export default MyInfo;

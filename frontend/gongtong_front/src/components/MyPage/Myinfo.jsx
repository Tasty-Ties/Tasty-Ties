import instalogo from "../../assets/MyPage/insta.png";
import youtubelogo from "../../assets/MyPage/Youtube.png";
import Button from "../../common/components/Button";
import { deleteId } from "../../service/MyPageAPI";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useMyPageStore from "../../store/MyPageStore";
import { useEffect } from "react";
import CountryFlags from "../../common/components/CountryFlags";

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
    nav("/delete");
  };

  return (
    <div>
      <p className="font-bold text-2xl">내 정보</p>
      <hr className="mt-2 mb-6" />
      {/* <div className="border-2 border-gray-400 shadow-xl p-5 rounded-lg"> */}
      <div>
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <p className="text-lg mb-0.5 font-semibold">닉네임</p>
            <p className="text-lg mb-2 text-gray-500">
              {informations.nickname}
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-lg mb-0.5 font-semibold">국적</p>
            <p className="text-lg mb-2 text-gray-500">
              {informations.country?.koreanName || "국적 정보 없음"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 my-2">
          <div>
            <p className="text-lg mb-0.5 font-semibold">모국어</p>
            <p className="text-lg mb-2 text-gray-500">
              {informations.language?.koreanName || "모국어 정보 없음"}
            </p>
          </div>
          <div>
            <p className="text-lg mb-0.5 font-semibold">마일리지</p>
            <p className="text-lg mb-2 text-gray-500">
              {informations.activityPoint}
            </p>
          </div>
        </div>
        <div>
          <p className="text-lg mb-0.5 font-semibold">이메일</p>
          <p className="text-lg mb-2 text-gray-500"> {informations.email}</p>
        </div>
        <div>
          <p className="text-lg mb-0.5 font-semibold">생년월일</p>
          <p className="text-lg mb-2 text-gray-500"> {informations.birth}</p>
        </div>
        <div>
          <p className="text-lg mb-0.5 font-semibold">수집한 국기</p>
          <p className="flex mb-2">
            {informations.collectedFlags?.map((flag, index) => (
              <CountryFlags
                key={index}
                countryCode={flag.countryCode}
                size="w-7"
              />
            ))}
          </p>
        </div>
        <div>
          <p className="text-lg mb-0.5 font-semibold">SNS 연동 현황</p>
          <div className="flex text-lg mb-2">
            <div className="flex">
              <img src={instalogo} alt="인스타로고" className="size-5" />
              &nbsp;
              <p className="text-lg  text-gray-500">
                {informations.instagramHandle || "연결된 계정이 없습니다"}
              </p>
            </div>
            &nbsp;&nbsp;
            <div className="flex">
              <img src={youtubelogo} alt="유튜브로고" className="size-5" />
              &nbsp;
              <p className="text-lg  text-gray-500">
                {informations.youtubeHandle || "연결된 계정이 없습니다"}
              </p>
            </div>
          </div>
        </div>
        <br />
        <div className="flex space-x-60">
          <Button
            text="내정보 수정하기"
            type="edit-complete"
            onClick={() => nav("/mypage/editinfo", { state: { informations } })}
          />
          <Button text="회원탈퇴" type="delete-id" onClick={handleDeleteId} />
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default MyInfo;

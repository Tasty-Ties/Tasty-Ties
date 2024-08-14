import { useEffect } from "react";
import Category from "../components/MyPage/Category";
import useMyPageStore from "../store/MyPageStore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);
  const informations = useMyPageStore((state) => state.informations);
  const accessToken = Cookies.get("accessToken");
  const nav = useNavigate();

  useEffect(() => {
    fetchInformations();
    if (!accessToken) {
      nav("/login");
    }
    // console.log(informations); 콘솔에 두번씩 출력됨
  }, []);

  if (informations.length === 0) {
    return <div>정보가 없습니다.</div>;
  }

  return (
    <div className="w-3/5 mt-5 mx-auto justify-center relative">
      <Category informations={informations} />
    </div>
  );
};

export default MyPage;

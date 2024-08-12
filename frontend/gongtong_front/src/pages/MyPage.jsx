import { useEffect } from "react";
import Category from "../components/MyPage/Category";
import { Outlet } from "react-router-dom";
import useMyPageStore from "../store/MyPageStore";

const MyPage = () => {
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);
  const informations = useMyPageStore((state) => state.informations);

  useEffect(() => {
    fetchInformations();
    // console.log(informations); 콘솔에 두번씩 출력됨
  }, []);

  if (informations.length === 0) {
    return <div>정보가 없습니다.</div>;
  }

  return (
    <div className="w-3/4 mt-10 mx-auto content-center relative">
      <Category informations={informations} />
    </div>
  );
};

export default MyPage;

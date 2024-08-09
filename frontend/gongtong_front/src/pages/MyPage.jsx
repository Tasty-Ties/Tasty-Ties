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
    <div className="flex">
      <div>
        <Category informations={informations} />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MyPage;

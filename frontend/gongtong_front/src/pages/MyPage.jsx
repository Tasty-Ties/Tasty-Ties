import { useEffect } from "react";
import Category from "../components/MyPage/Category";
import { Outlet } from "react-router-dom";
import useMyPageStore from "../store/MyPageStore";

const MyPage = () => {
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);
  const informations = useMyPageStore((state) => state.informations);

  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);

  if (!informations) {
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

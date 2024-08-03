import { useEffect } from "react";
import Category from "../components/MyPage/Category";
import Myinfo from "../components/MyPage/Myinfo";
import useMyPageStore from "../store/MyPageStore";

const MyPage = () => {
  const fetchInformations = useMyPageStore((state) => state.fetchInformations);
  const informations = useMyPageStore((state) => state.informations);
  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);
  console.log(fetchInformations);
  console.log("마이페이지", informations);

  return (
    <>
      마이페이지
      <div>
        <Category informations={informations} />
        <Myinfo informations={informations} />
      </div>
    </>
  );
};

export default MyPage;

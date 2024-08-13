import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RankingLeft from "../components/Ranking/RankingLeft";
import RankingPagination from "../components/Ranking/RankingPagination";
import RankingRight from "../components/Ranking/RankingRight";
import { getRankingList } from "../service/RankingAPI";
import useRankingStore from "../store/RankingStore";

const Ranking = () => {
  const { topRanking, fetchRankingData } = useRankingStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rankingList, setRankingList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [sort, setSort] = useState(searchParams.get("sort") || "weekly");

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const countPerPage = 7;
  const pageCount = 5;

  const fetchRankingList = async (sort, page) => {
    try {
      const response = await getRankingList(sort, page);
      setRankingList(response);
      setTotalPage(response.totalPage);
    } catch (error) {
      console.error("랭킹 리스트를 가져오는 데 실패했습니다:", error);
    }
  };

  const handleSortChange = (selectedSort) => {
    setSort(selectedSort);
    setSearchParams({ sort: selectedSort, page: "1" });
  };

  useEffect(() => {
    fetchRankingData(sort, currentPage);
    fetchRankingList(sort, currentPage);
  }, [sort, currentPage]);

  return (
    <div className="grid grid-cols-10 mx-auto ">
      <div className="col-span-4 mr-24 mt-36">
        <RankingLeft topRanking={topRanking} />
      </div>
      <div className="col-span-6 mt-10">
        <RankingRight
          rankingList={rankingList}
          sort={sort}
          onSortChange={handleSortChange}
        />
        <RankingPagination
          pageCount={pageCount}
          currentPage={currentPage}
          totalPage={totalPage}
        />
      </div>
    </div>
  );
};
export default Ranking;

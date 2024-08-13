import RankingDropdown from "./../Ranking/RankingDropdown";
import RankingProfile from "./RankingProfile";
import Pagination from "./../../common/components/Pagination";

const RankingRight = ({ rankingList, sort, onSortChange }) => {
  return (
    <>
      <div className="flex flex-row-reverse">
        <RankingDropdown sort={sort} onSortChange={onSortChange} />
      </div>
      <div className="grid grid-cols-12 text-center">
        <div className="col-span-1">순위</div>
        <div className="col-span-2">닉네임</div>
        <div className="col-span-1">개강</div>
        <div className="col-span-1">수강</div>
        <div className="col-span-1">마일리지</div>
        <div className="col-span-6">한줄 소개</div>
      </div>
      <hr className="my-4" />
      <RankingProfile rankingList={rankingList} />
    </>
  );
};
export default RankingRight;

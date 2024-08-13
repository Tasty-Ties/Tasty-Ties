import { Link } from "react-router-dom";
import Profile from "./../../common/components/Profile";

const RankingProfile = (rankingList) => {
  console.log(rankingList.rankingList);

  // myRanked 정보가 현재 페이지에 있는지 확인
  const isMyRankedOnCurrentPage = rankingList.rankingList.rankedUsers?.some(
    (user) => user.userId === rankingList.rankingList.myRanked?.userId
  );

  return (
    <>
      {!isMyRankedOnCurrentPage && rankingList.rankingList.myRanked && (
        <div className="grid grid-cols-12 text-center py-3 items-center border-2 rounded-xl shadow-md">
          <div className="col-span-1">
            {rankingList.rankingList.myRanked.rank === 0
              ? "순위없음"
              : rankingList.rankingList.myRanked.rank}
          </div>
          <Link to={``} className="col-span-2 flex items-center">
            <span className="mr-3">
              <img
                src={rankingList.rankingList.myRanked.profileImageUrl}
                className="w-8 truncate"
              />
            </span>
            <span>{rankingList.rankingList.myRanked.nickname}</span>
          </Link>
          <div className="col-span-1">
            {rankingList.rankingList.myRanked.classesHosted}
          </div>
          <div className="col-span-1">
            {rankingList.rankingList.myRanked.classesAttended}
          </div>
          <div className="col-span-1">
            {rankingList.rankingList.myRanked.score}
          </div>

          {rankingList.rankingList.myRanked.description === null ? (
            <div className="col-span-6 text-gray-600">자기소개가 없습니다.</div>
          ) : (
            <div className="col-span-6">
              rankingList.rankingList.myRanked?.description
            </div>
          )}
        </div>
      )}

      {rankingList.rankingList.rankedUsers &&
        rankingList.rankingList.rankedUsers.map((user, index) => (
          <div
            className={`grid grid-cols-12 text-center py-3 items-center ${
              isMyRankedOnCurrentPage ? "border-2 rounded-xl shadow-md" : ""
            }`}
            key={index}
          >
            <div className="col-span-1">{user.rank}</div>
            <div className="col-span-2 flex items-center">
              <span className="mr-3">
                <img src={user.profileImageUrl} className="w-8" />
              </span>
              <span>{user.nickname}</span>
            </div>
            <div className="col-span-1">{user.classesHosted}</div>
            <div className="col-span-1">{user.classesAttended}</div>
            <div className="col-span-1">{user.score}</div>
            {user.description === null ? (
              <div className="col-span-6 text-gray-600">
                자기소개가 없습니다.
              </div>
            ) : (
              <div className="col-span-6 truncate">{user.description}</div>
            )}
          </div>
        ))}
    </>
  );
};
export default RankingProfile;

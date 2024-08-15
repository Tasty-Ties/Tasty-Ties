import { Link } from "react-router-dom";
import Profile from "./../../common/components/Profile";
import defaultImage from "./../../assets/MyPage/기본프로필사진.jpg";

const RankingProfile = ({ rankingList }) => {
  // myRanked 정보가 현재 페이지에 있는지 확인
  const isMyRankedOnCurrentPage = rankingList.rankedUsers?.some(
    (user) => user.userId === rankingList.myRanked?.userId
  );

  return (
    <>
      {!isMyRankedOnCurrentPage && rankingList.myRanked && (
        <div className="grid grid-cols-12 text-center py-3 items-center border-2 rounded-xl shadow-md">
          <div className="col-span-1">
            {rankingList.myRanked.rank === 0
              ? "순위없음"
              : rankingList.myRanked.rank}
          </div>
          <div className="col-span-2 flex items-center">
            <Link to="/mypage">
              <span className="mr-3">
                <img
                  src={rankingList.myRanked.profileImageUrl || defaultImage}
                  className="w-8 h-8 bg-center rounded-full"
                  alt="Profile"
                />
              </span>
              <span>{rankingList.myRanked.nickname}</span>
            </Link>
          </div>
          <div className="col-span-1">{rankingList.myRanked.classesHosted}</div>
          <div className="col-span-1">
            {rankingList.myRanked.classesAttended}
          </div>
          <div className="col-span-1">{rankingList.myRanked.score}</div>
          <div className="col-span-6">
            {rankingList.myRanked.description || "자기소개가 없습니다."}
          </div>
        </div>
      )}

      {rankingList.rankedUsers &&
        rankingList.rankedUsers.map((user, index) => (
          <div
            className={`grid grid-cols-12 text-center py-3 items-center ${
              user.userId === rankingList.myRanked?.userId
                ? "border-2 rounded-xl shadow-md"
                : ""
            }`}
            key={index}
          >
            <div className="col-span-1">{user.rank}</div>
            {user.userId === rankingList.myRanked?.userId ? (
              <Link to="/mypage" className="col-span-2 flex items-center">
                <span className="mr-3">
                  <img
                    src={user.profileImageUrl || defaultImage}
                    className="w-8 h-8 bg-center rounded-full"
                  />
                </span>
                <span>{user.nickname}</span>
              </Link>
            ) : (
              <Link
                to={`/otherpage/${user.username}`}
                className="col-span-2 flex items-center"
              >
                <span className="mr-3">
                  <img
                    src={user.profileImageUrl || defaultImage}
                    className="w-8 h-8 bg-center rounded-full"
                  />
                </span>
                <span>{user.nickname}</span>
              </Link>
            )}
            <div className="col-span-1">{user.classesHosted}</div>
            <div className="col-span-1">{user.classesAttended}</div>
            <div className="col-span-1">{user.score}</div>
            <div className="col-span-6 truncate">
              {user.description || "자기소개가 없습니다."}
            </div>
          </div>
        ))}
    </>
  );
};

export default RankingProfile;

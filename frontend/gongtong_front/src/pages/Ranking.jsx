import RankingRight from "../components/Ranking/RankingRight";
import RankingLeft from "./../components/Ranking/RankingLeft";
const Ranking = () => {
  return (
    <div className="grid grid-cols-10 mx-auto mt-20">
      <div className="col-span-4 mt-14">
        <RankingLeft />
      </div>
      <div className="col-span-6">
        <RankingRight />
      </div>
    </div>
  );
};
export default Ranking;

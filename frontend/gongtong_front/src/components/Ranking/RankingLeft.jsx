import { useState, useEffect } from "react";
import RankingCount from "./RankingCount";
import "./../../styles/Ranking/RankingLeft.css";

export default function App({ topRanking, sort }) {
  const data = [
    {
      rank: topRanking[1]?.rank,
      num: topRanking[1]?.score,
      color: "#C0C0C0",
      profileImg: topRanking[1]?.profileImageUrl,
      id: topRanking[1]?.nickname,
    },
    {
      rank: topRanking[0]?.rank,
      num: topRanking[0]?.score,
      color: "#FFD700",
      profileImg: topRanking[0]?.profileImageUrl,
      id: topRanking[0]?.nickname,
    },
    {
      rank: topRanking[2]?.rank,
      num: topRanking[2]?.score,
      color: "#CD7F32",
      profileImg: topRanking[2]?.profileImageUrl,
      id: topRanking[2]?.nickname,
    },
  ];
  const barHeights = [170, 300, 100];
  const [animate, setAnimate] = useState(false);
  const [showCrown, setShowCrown] = useState(false);

  useEffect(() => {
    setAnimate(false);
    setShowCrown(false);
    const timer1 = setTimeout(() => setAnimate(true), 100);
    const timer2 = setTimeout(() => setShowCrown(true), 2100);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [sort]);

  return (
    <div className="flex justify-center align-middle" key={sort}>
      {data.map((entry, index) => (
        <div
          key={index}
          style={{
            margin: "0 20px",
            textAlign: "center",
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div>
            <div className="relative">
              <img
                src={entry.profileImg}
                alt={`${entry.id}'s profile`}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
              />
              {entry.rank === 1 && showCrown && (
                <span
                  className="crown-effect"
                  style={{
                    position: "absolute",
                    top: "-70px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <img src="images/ranking/crown_gold.svg" alt="" />
                </span>
              )}
            </div>
            <div className="text-black mt-2 font-bold text-base">
              {entry.id}
            </div>
            <div
              style={{
                fontSize: "12px",
              }}
            >
              <RankingCount
                num={entry.num}
                duration={2000}
                key={`${sort}-${entry.num}`}
              />
            </div>
          </div>
          <div
            style={{
              width: "100px",
              height: animate ? `${barHeights[index]}px` : "0px",
              backgroundColor: entry.color,
              transition: "height 2s ease-out",
              borderRadius: "10px 10px 0 0",
            }}
          />
        </div>
      ))}
    </div>
  );
}

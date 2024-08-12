import { useState, useEffect } from "react";
import RankingCount from "./RankingCount";
import "./../../styles/Ranking/RankingLeft.css";

const data = [
  {
    rank: 2,
    num: 1000,
    color: "#C0C0C0",
    profileImg: "images/ranking/3d_avatar_1.png",
    id: "박소정",
  },
  {
    rank: 1,
    num: 1015,
    color: "#FFD700",
    profileImg: "images/ranking/3d_avatar_1.png",
    id: "이지원",
  },
  {
    rank: 3,
    num: 980,
    color: "#CD7F32",
    profileImg: "images/ranking/3d_avatar_1.png",
    id: "오성윤",
  },
];

export default function App() {
  const barHeights = [170, 300, 100];
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="flex justify-center align-middle ">
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
              {entry.rank === 1 && (
                <span
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
              <RankingCount num={entry.num} duration={2000} />
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

import React, { useEffect, useState } from "react";

const RankingCount = ({ num, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startCount = count;
    const startTime = performance.now();

    const animateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        setCount(Math.floor(startCount + progress * (num - startCount)));
        requestAnimationFrame(animateCount);
      } else {
        setCount(num);
      }
    };

    requestAnimationFrame(animateCount);
  }, [num, duration]);

  return (
    <div className="text-xl text-black mb-3">
      <span
        style={{
          textShadow: "0px 0px 15px rgba(255, 255, 255, 0.6)",
        }}
      >
        {count}
      </span>
    </div>
  );
};

export default RankingCount;

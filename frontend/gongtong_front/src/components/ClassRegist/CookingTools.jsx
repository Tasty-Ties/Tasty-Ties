import React, { useState } from "react";

const CookingTools = ({ cookingTools, setCookingTools }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault(); // 항상 기본 동작을 방지
      if (inputValue.trim()) {
        setCookingTools([...cookingTools, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  return (
    <div className="regist-component-box">
      <div className="input-box">
        <div>
          <input
            type="text"
            id="cookingTools"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="조리 도구를 입력하고 Enter키를 눌러주세요"
            className="w-full border p-2 rounded"
          />
          <div className="mt-3">
            {cookingTools.map((tool, index) => (
              <span
                key={index}
                className="mr-3 rounded-3xl px-2 py-1 bg-second-600 text-white"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingTools;

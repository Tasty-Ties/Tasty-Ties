import React, { useState } from "react";

const CookingTools = ({ cookingTools, setCookingTools }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && inputValue.trim()) {
      setCookingTools([...cookingTools, inputValue.trim()]);
      setInputValue("");
      e.preventDefault(); // 엔터가 form태그 제출하는 것을 막기 위함
    }
  };
  return (
    <div className="regist-component-box">
      <div className="title-box">조리도구</div>
      <div className="input-box">
        <div>
          <input
            type="text"
            id="cookingTools"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="조리 도구를 입력해주세요"
          />
          <div>
            {cookingTools.map((tool, index) => (
              <span key={index}>{tool}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingTools;

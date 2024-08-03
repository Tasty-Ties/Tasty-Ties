import { useState } from "react";

const CookingClassTags = ({ hashtags, setHashtags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    // 엔터 키코드만 + 빈 문자열 방지
    if ((e.key === "Enter" || e.keyCode === 13) && inputValue.trim()) {
      setHashtags([...hashtags, inputValue.trim()]);
      setInputValue("");
      e.preventDefault();
    }
  };
  return (
    <div className="regist-component-box">
      <div className="title-box">
        <label htmlFor="hashtage">해쉬태그</label>
      </div>
      <div className="input-box">
        <input
          type="text"
          id="hashtags"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="해시태그를 입력해주세요"
        />
        <div>
          {hashtags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CookingClassTags;

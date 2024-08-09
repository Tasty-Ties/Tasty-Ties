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
      <div className="input-box">
        <input
          type="text"
          id="hashtags"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="해시태그를 입력하고 Enter키를 눌러주세요"
          className="w-full border p-2 rounded"
        />
        <div className="mt-3">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="mr-3 rounded-3xl px-2 py-1 bg-second-600 text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CookingClassTags;

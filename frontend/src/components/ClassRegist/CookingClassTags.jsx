import { useState } from "react";

const CookingClassTags = ({ hashtags, setHashtags, onBlur }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault(); // 항상 기본 동작을 방지
      if (inputValue.trim()) {
        if (hashtags.length >= 5) {
          alert("최대 5개의 해시태그만 입력할 수 있습니다.");
          return;
        }
        setHashtags([...hashtags, inputValue.trim()]);
        setInputValue("");
      }
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
          onBlur={onBlur}
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

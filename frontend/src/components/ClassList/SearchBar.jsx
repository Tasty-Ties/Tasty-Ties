import React, { useState } from "react";
import ClassListDropdown from "./ClassListDropdown";

const SearchBar = ({ onSearch }) => {
  const [classification, setClassification] = useState("클래스명");
  const [sort, setSort] = useState("최신순");
  const [localFood, setLocalFood] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = () => {
    onSearch({
      [classification === "클래스명" ? "title" : "username"]: searchWord,
      useLocalFilter: localFood,
      sort: sort === "최신순" ? "createTime,desc" : "createTime,asc",
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center p-2 bg-white rounded-full shadow-lg max-w-4xl mx-auto border border-gray-300">
      <div className="relative flex items-center left-2">
        <ClassListDropdown
          title={classification}
          items={["클래스명", "닉네임"]}
          setClassification={setClassification}
        />
      </div>

      <div className="h-6 border-l border-gray-300 mx-4"></div>

      <input
        type="text"
        className="px-4 py-2 text-gray-700 rounded-full focus:outline-none flex-grow"
        placeholder="검색어를 입력해주세요"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <div className="h-6 border-l border-gray-300 mx-4"></div>

      <div className="relative flex items-center">
        <ClassListDropdown
          title={sort}
          items={["최신순", "오래된순"]}
          setSort={setSort}
        />
      </div>

      <div className="h-6 border-l border-gray-300 mx-4"></div>

      <label className="flex items-center ml-4">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 accent-first"
          checked={localFood}
          onChange={() => setLocalFood(!localFood)}
        />
        <span className="ml-2 text-gray-700">현지인 음식</span>
      </label>

      <button className="ml-8 p-1 bg-first rounded-full" onClick={handleSearch}>
        <svg
          width="40"
          height="41"
          viewBox="0 0 40 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_224_9109)">
            <path
              d="M27.6 29.7666L21.3 23.4666C20.8 23.8666 20.225 24.1833 19.575 24.4166C18.925 24.6499 18.2333 24.7666 17.5 24.7666C15.6833 24.7666 14.1458 24.1374 12.8875 22.8791C11.6292 21.6208 11 20.0833 11 18.2666C11 16.4499 11.6292 14.9124 12.8875 13.6541C14.1458 12.3958 15.6833 11.7666 17.5 11.7666C19.3167 11.7666 20.8542 12.3958 22.1125 13.6541C23.3708 14.9124 24 16.4499 24 18.2666C24 18.9999 23.8833 19.6916 23.65 20.3416C23.4167 20.9916 23.1 21.5666 22.7 22.0666L29 28.3666L27.6 29.7666ZM17.5 22.7666C18.75 22.7666 19.8125 22.3291 20.6875 21.4541C21.5625 20.5791 22 19.5166 22 18.2666C22 17.0166 21.5625 15.9541 20.6875 15.0791C19.8125 14.2041 18.75 13.7666 17.5 13.7666C16.25 13.7666 15.1875 14.2041 14.3125 15.0791C13.4375 15.9541 13 17.0166 13 18.2666C13 19.5166 13.4375 20.5791 14.3125 21.4541C15.1875 22.3291 16.25 22.7666 17.5 22.7666Z"
              fill="#fff"
            />
          </g>
          <defs>
            <clipPath id="clip0_224_9109">
              <rect y="0.766602" width="40" height="40" rx="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;

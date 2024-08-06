import "@styles/ClassList/ClassListSearch.css";
import { useEffect, useState } from "react";

const FRONT_SERVER_URL = import.meta.env.VITE_FRONT_SERVER;

const ClassListSearch = ({ setSearchCondition }) => {
  const [localSearchCondition, setLocalSearchCondition] = useState({
    searchType: "title",
    searchQuery: "",
    sortOrder: "createTime,desc",
    isLocalFood: false,
  });

  useEffect(() => {
    console.log(localSearchCondition);
  }, [localSearchCondition]);

  const onChange = (e) => {
    if (e.target.name === "isLocalFood") {
      setLocalSearchCondition({
        ...localSearchCondition,
        [e.target.name]: e.target.checked,
      });
    } else {
      setLocalSearchCondition({
        ...localSearchCondition,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCondition((prev) => ({
      ...prev,
      searchType: localSearchCondition.searchType,
      searchQuery: localSearchCondition.searchQuery,
      sortOrder: localSearchCondition.sortOrder,
      isLocalFood: localSearchCondition.isLocalFood,
      page: 0,
    }));
  };

  return (
    <form className="ClassListSearch">
      <div className="sub-box">
        <select
          name="searchType"
          onChange={onChange}
          className="select-box"
          defaultValue="title"
        >
          <option value="title">클래스명</option>
          <option value="hostName">닉네임</option>
        </select>
        <div className="input-box">
          <input
            type="text"
            placeholder="검색"
            className="search-input"
            name="searchQuery"
            value={localSearchCondition.searchQuery}
            onChange={onChange}
          />
          <button id="search-btn" type="submit">
            <img
              name="searchQuery"
              src={`${FRONT_SERVER_URL}/images/classImages/search-icon.png`}
              alt="검색 아이콘"
              className="search-Img"
            />
          </button>
        </div>
      </div>
      <div className="sub-box">
        <div>
          {/* <select name="" id="" className="select-box">
            <option value="">All</option>
            <option value="">음식 문화권</option>
            <option value="">클래스 진행 언어</option>
          </select> */}
          <select
            name="sortOrder"
            onChange={onChange}
            value={localSearchCondition.sortOrder}
            className="select-box"
          >
            <option value="createTime,desc">최신순</option>
            <option value="startTime,asc">클래스 시간순</option>
          </select>
        </div>
        <div className="chk-box">
          <label htmlFor="isLocalFood">현지인 음식</label>
          <input
            type="checkbox"
            onChange={onChange}
            checked={localSearchCondition.isLocalFood}
            name="isLocalFood"
            id="isLocalFood"
          />
        </div>
      </div>
    </form>
  );
};
export default ClassListSearch;

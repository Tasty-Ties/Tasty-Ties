import "@styles/ClassList/ClassListSearch.css";

const ClassListSearch = () => {
  return (
    <form className="ClassListSearch">
      <div className="sub-box">
        <select name="" id="" className="select-box">
          <option value="">클래스명</option>
          <option value="">닉네임</option>
        </select>
        <div className="input-box">
          <input type="text" placeholder="검색" className="search-input" />
          <button id="search-btn">
            <img
              src="http://localhost:5173/images/classImages/search-icon.png"
              alt="검색 아이콘"
              className="search-Img"
            />
          </button>
        </div>
      </div>
      <div className="sub-box">
        <div>
          <select name="" id="" className="select-box">
            <option value="">All</option>
            <option value="">음식 문화권</option>
            <option value="">클래스 진행 언어</option>
          </select>
          <select name="" id="" className="select-box">
            <option value="">최신순</option>
            <option value="">조회순</option>
            <option value="">클래스 시간순</option>
            <option value="">예약 마감순</option>
          </select>
        </div>
        <div className="chk-box">
          <label htmlFor="localFood">현지인 음식</label>
          <input type="checkbox" name="localFood" />
        </div>
      </div>
    </form>
  );
};
export default ClassListSearch;

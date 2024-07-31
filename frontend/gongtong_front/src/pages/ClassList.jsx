import { Link } from "react-router-dom";

import ClassItem from "@components/ClassList/ClassListItem";
import ClassListSearch from "@components/ClassList/ClassListSearch";

import "@styles/ClassList/ClassList.css";

const ClassList = () => {
  return (
    <>
      <div className="classlist-components-box">
        <ClassListSearch />
        <div className="classlist-item-box">
          <ClassItem />
        </div>
      </div>
      <Link to="" className="add-class-button">
        <img
          src="http://localhost:5173/images/classImages/add-icon.png"
          alt="요리클래스 등록하기"
        />
      </Link>
    </>
  );
};

export default ClassList;

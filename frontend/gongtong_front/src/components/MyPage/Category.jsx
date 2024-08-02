import { Link } from "react-router-dom";

const Category = () => {
  return (
    <>
      <div>
        <br />
        <div>프로필</div>
        <br />
        <ul>
          <li className="text-xl">클래스</li>
          <li>
            <Link to="">예약한 클래스</Link>
          </li>
          <li>
            <Link to="">수업할 클래스</Link>
          </li>
          <li>
            <Link to="">참여한 클래스</Link>
          </li>
        </ul>
        <br />
        <ul>
          <li className="text-xl">나의 활동</li>
          <li>
            <Link to="">마일리지</Link>
          </li>
          <li>
            <Link to="">숏폼</Link>
          </li>
        </ul>
        <br />
      </div>
    </>
  );
};

export default Category;

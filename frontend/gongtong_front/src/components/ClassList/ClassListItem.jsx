import "@styles/ClassList/ClassListItem.css";

const ClassListItem = () => {
  return (
    <>
      <a href="">
        <div className="ClassListItem-imgBox">
          <img
            src="http://localhost:5173/images/classImages/food-img.png"
            alt="클래스 썸네일"
            className="food-img"
          />
          <img
            src="http://localhost:5173/images/classImages/Korea.png"
            alt="국기"
            className="flag-img"
          />
        </div>
        <div className="ClassListItem-TextBox">
          <div className="title">
            건강한 아침 식사 아이디어 : 충전을 위한 메뉴
          </div>
          <div className="sub-box">
            <div className="date">2024-07-11 17:00 ~ 17:40</div>
            <div className="nickname">죠니월드</div>
          </div>
        </div>
      </a>
    </>
  );
};
export default ClassListItem;

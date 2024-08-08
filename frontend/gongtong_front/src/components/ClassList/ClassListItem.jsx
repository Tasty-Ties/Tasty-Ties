import "@styles/ClassList/ClassListItem.css";
const FRONT_SERVER_URL = import.meta.env.VITE_FRONT_SERVER;

const ClassListItem = (content) => {
  return (
    <>
      <a href="">
        <div className="ClassListItem-imgBox">
          <img
            src={content.content.mainImage}
            alt="클래스 썸네일"
            className="food-img"
          />
          <img
            src={`${FRONT_SERVER_URL}/images/classImages/Korea.png`}
            alt="국기"
            className="flag-img"
          />
        </div>
        <div className="ClassListItem-TextBox">
          <div className="title">{content.content.title}</div>
          <div className="sub-box">
            <div className="date">
              {content.content.startTime.substring(0, 10)}&nbsp;
              {content.content.startTime.substring(11, 16)}&nbsp;~&nbsp;
              {content.content.endTime.substring(11, 16)}
            </div>
            <div className="nickname">{content.content.hostName}</div>
          </div>
        </div>
      </a>
    </>
  );
};
export default ClassListItem;

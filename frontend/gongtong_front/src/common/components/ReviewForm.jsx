// import "../../styles/MyPage/Class.css";

const ReviewForm = ({ review }) => {
  const date = review.cookingClassReviewCreateTime?.substring(
    0,
    review.cookingClassReviewCreateTime.indexOf("T")
  );

  return (
    review.comment && (
      <div className="flex">
        <div className="flex-col">
          <p>{review.title}</p>
          <p>{review.comment}</p>
          <div className="flex">
            <p>{review.nickname}</p>
            <p>{date}</p>
          </div>
        </div>
        <div>
          <img src={review.mainImage} alt="클래스사진" />
          <img src={review.countryImageUrl} alt="나라사진" />
        </div>
      </div>
    )
  );
};

export default ReviewForm;

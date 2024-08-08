const Lecture = ({ review }) => {
  const date = review.cookingClassReviewCreateTime.substring(
    0,
    review.startTime.indexOf("T")
  );

  return (
    <>
      <div className="flex">
        <div className="flex flex-col">
          <p>{review.title}</p>
          <p>{review.comment}</p>
          <p>{review.nickName}</p>
          <p>{date}</p>
        </div>
        <p>
          <img src={review.mainImage} alt="클래스메인사진" />
          {review.countryImageUrl}
        </p>
      </div>
    </>
  );
};
export default Lecture;

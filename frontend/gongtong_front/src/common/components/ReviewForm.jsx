// import "../../styles/MyPage/Class.css";

const ReviewForm = ({ review }) => {
  const date = review.cookingClassReviewCreateTime?.substring(
    0,
    review.cookingClassReviewCreateTime.indexOf("T")
  );

  return (
    review.comment && (
      <div className="flex w-auto place-content-center space-x-48 p-3">
        <div className="flex-col w-72 mt-4">
          <span className="mb-2 truncate text-gray-700 bg-slate-200 rounded-md px-3">
            {review.title}
          </span>
          <p className="truncate my-3">{review.comment}</p>
          <div className="flex text-xs text-gray-600 mr-6">
            <p>{review.nickname}</p>&nbsp;
            <p>|</p>&nbsp;
            <p>{date}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <div>
            <img
              src={review.mainImage}
              alt="클래스사진"
              className="w-52 h-32 object-cover"
            />
          </div>
          {/* <span>
          <img src={review.countryImageUrl} alt="나라사진" />
          </span> */}
        </div>
      </div>
    )
  );
};

export default ReviewForm;

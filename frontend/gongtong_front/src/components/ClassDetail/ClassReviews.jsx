import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useCookingClassStore from "./../../store/CookingClassStore";

const ClassReview = () => {
  const { reviews } = useOutletContext();
  const { classReviews, fetchClassReviews } = useCookingClassStore((state) => ({
    classReviews: state.classReviews,
    fetchClassReviews: state.fetchClassReviews,
  }));
  useEffect(() => {
    fetchClassReviews(reviews.id);
  }, []);
  return (
    <>
      <div className="w-full mt-20">
        {classReviews > 0 ? (
          classReviews.map((classReview, index) => (
            <div key={index} className="flex my-6">
              <div className="basis-4/6 truncate mr-4 ">
                {classReview.comment}
              </div>
              <div className="basis-1/6 text-right mr-4">
                {classReview.nickname}
              </div>
              <div className="basis-1/6 text-right">
                {classReview.cookingClassReviewCreateTime?.substring(0, 10)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <div>
              <img
                src="/images/classImages/alert.svg"
                className="mx-auto w-12 mb-5"
              />
            </div>
            리뷰가 존재하지 않습니다.
          </div>
        )}
      </div>
    </>
  );
};

export default ClassReview;

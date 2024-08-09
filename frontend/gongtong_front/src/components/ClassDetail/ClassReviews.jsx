import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useCookingClassStore from "../../store/CookingClassStore";

const ClassReview = () => {
  const { reviews } = useOutletContext();
  const { classReviews, fetchClassReviews } = useCookingClassStore((state) => ({
    classReviews: state.classReviews,
    fetchClassReviews: state.fetchClassReviews,
  }));
  useEffect(() => {
    fetchClassReviews(reviews.id);
  }, []);
  console.log(classReviews);
  return (
    <>
      <div className="w-full">
        {classReviews &&
          classReviews.map((classReview, index) => (
            <div key={index} className="flex">
              <div className="basis-4/6">{classReview.comment}</div>
              <div className="basis-1/6">{classReview.nickname}</div>
              <div className="basis-1/6">
                {classReview.cookingClassReviewCreateTime}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ClassReview;

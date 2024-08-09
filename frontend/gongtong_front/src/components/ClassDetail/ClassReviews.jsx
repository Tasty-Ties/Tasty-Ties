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
  console.log(classReviews);
  return (
    <>
      <div className="w-full mt-20">
        {classReviews &&
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
          ))}
      </div>
    </>
  );
};

export default ClassReview;

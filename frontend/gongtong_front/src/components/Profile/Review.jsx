import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useProfileStore from "../../store/ProfileStore";
import Pagination from "../../common/components/Pagination";
import HorizontalCard from "../../common/components/ReviewCard";

const Review = () => {
  const { username } = useParams();
  const reviews = useProfileStore((state) => state.reviews);
  const fetchReviews = useProfileStore((state) => state.fetchReviews);

  useEffect(() => {
    fetchReviews(username);
  }, []);
  console.log(reviews);

  return (
    <div>
      <div>수강평</div>
      {reviews.map((review, index) => (
        <HorizontalCard key={index} reviews={review} />
      ))}
    </div>
  );
};
export default Review;

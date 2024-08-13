import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useProfileStore from "../../store/ProfileStore";
import Pagination from "../../common/components/Pagination";
import HorizontalCard from "../../common/components/ReviewCard";

const Review = () => {
  const { username } = useParams();
  const reviews = useProfileStore((state) => state.reviews);
  const fetchReviews = useProfileStore((state) => state.fetchReviews);
  const totalItems = useProfileStore((state) => state.totalItems);

  const location = useLocation();

  const itemCountPerPage = 4;
  const pageCount = 5;

  // 쿼리 파라미터에서 페이지 정보 가져오기
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchReviews(username, currentPage, itemCountPerPage);
  }, [currentPage]);
  console.log(reviews);

  return (
    <div>
      <div>수강평</div>
      {reviews.map((review, index) => (
        <HorizontalCard key={index} reviews={review} />
      ))}
      <div>
        <Pagination
          totalItems={totalItems}
          itemCountPerPage={itemCountPerPage}
          pageCount={pageCount}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};
export default Review;

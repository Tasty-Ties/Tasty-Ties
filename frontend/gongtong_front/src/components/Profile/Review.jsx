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
      {/* <div>{reviews[0].title}</div>
      <div>{reviews[0].comment}</div>
      <div>{reviews[0].cookingClassReviewCreateTime}</div>
      <div>{reviews[0].nickname}</div>
      <div>{reviews[0].mainImage}</div> */}
      <HorizontalCard
        title={reviews[0]?.title}
        comment={reviews[0]?.comment}
        date={reviews[0]?.cookingClassReviewCreateTime}
        nickname={reviews[0]?.nickname}
        image={reviews[0]?.mainImage}
      />
    </div>
  );
};
export default Review;

// import {
//   Card,
//   CardHeader,
//   CardBody,
//   Typography,
//   Button,
// } from "@material-tailwind/react";

// export function HorizontalCard() {
//   return (
//     <Card className="w-full max-w-[48rem] flex-row">
//       <CardHeader
//         shadow={false}
//         floated={false}
//         className="m-0 w-2/5 shrink-0 rounded-r-none"
//       >
//         <img
//           src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
//           alt="card-image"
//           className="h-full w-full object-cover"
//         />
//       </CardHeader>
//       <CardBody>
//         <Typography variant="h6" color="gray" className="mb-4 uppercase">
//           startups
//         </Typography>
//         <Typography variant="h4" color="blue-gray" className="mb-2">
//           Lyft launching cross-platform service this week
//         </Typography>
//         <Typography color="gray" className="mb-8 font-normal">
//           Like so many organizations these days, Autodesk is a company in
//           transition. It was until recently a traditional boxed software company
//           selling licenses. Yet its own business model disruption is only part
//           of the story
//         </Typography>
//         <a href="#" className="inline-block">
//           <Button variant="text" className="flex items-center gap-2">
//             Learn More
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//               className="h-4 w-4"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
//               />
//             </svg>
//           </Button>
//         </a>
//       </CardBody>
//     </Card>
//   );
// }

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const HorizontalCard = ({ review }) => {
  const date = review.cookingClassReviewCreateTime.substring(
    0,
    review.cookingClassReviewCreateTime.indexOf("T")
  );

  return (
    <Card className="w-full w-[46rem] h-32 flex-row items-center">
      {" "}
      {/* Card의 고정 너비 */}
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 h-32 w-52 shrink-0 rounded-lg"
      >
        <img
          src={review?.mainImage}
          alt="card-image"
          className="h-full w-full object-cover object-center"
        />
      </CardHeader>
      <CardBody className="flex flex-col justify-between w-full max-w-[calc(100%-13rem)]">
        {" "}
        {/* CardBody의 고정 너비 */}
        <Typography
          variant="h5"
          color="blue-gray"
          className="font-nanum text-lg mb-1 truncate"
        >
          {review?.title}
        </Typography>
        <Typography
          variant="h6"
          color="gray"
          className="font-nanum text-lg mb-1 uppercase truncate"
        >
          {review?.comment}
        </Typography>
        <div className="flex justify-between">
          <Typography
            color="gray"
            className="font-nanum text-sm font-normal truncate"
          >
            {review?.nickname}
          </Typography>
          <Typography
            color="gray"
            className="font-nanum text-sm font-normal truncate"
          >
            {date}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default HorizontalCard;

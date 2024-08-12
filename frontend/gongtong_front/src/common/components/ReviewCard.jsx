import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const HorizontalCard = ({ title, comment, date, nickname, image }) => {
  return (
    <Card className="w-full max-w-[48rem] h-40 flex-row">
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 h-32 w-52 shrink-0 rounded-lg"
      >
        <img
          src={image}
          alt="card-image"
          className="h-full w-full object-cover object-center"
        />
      </CardHeader>
      <CardBody className="overflow-hidden">
        <Typography variant="h5" color="blue-gray" className="mb-1 truncate">
          {title}
        </Typography>
        <Typography
          variant="h6"
          color="gray"
          className="mb-1 uppercase truncate"
        >
          {comment}
        </Typography>
        <Typography color="gray" className="text-sm font-normal truncate">
          {date}
        </Typography>
        <Typography color="gray" className="text-sm font-normal truncate">
          {nickname}
        </Typography>
      </CardBody>
    </Card>
  );
};

export default HorizontalCard;

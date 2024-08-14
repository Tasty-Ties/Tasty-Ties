import { Card, CardHeader, CardBody, Typography, Chip } from "@material-tailwind/react";
import React from "react";
import CountryChip from "./CountryChip";

const CookingClassListItem = () => {
  const country = { code: "KR", name: "한국어", imgSrc: "/images/countries/KR.svg" };

  return (
    <Card className="shadow-none transform transition-transform duration-300 hover:scale-[1.03] hover:cursor-pointer">
      <CardBody className="h-full">
        <img
          src="https://docs.material-tailwind.com/img/team-3.jpg"
          alt="profile-picture"
          className="object-cover rounded-md"
        />
        <div className="flex mt-2.5">
          <CountryChip country={country} />
        </div>
        <div className="ml-1">
          <Typography variant="h5" color="blue-gray" className="mt-2.5 mb-1">
            Natalie Paisley
          </Typography>
          <Typography color="blue-gray" className="text-sm">
            CEO / Co-Founder
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default CookingClassListItem;

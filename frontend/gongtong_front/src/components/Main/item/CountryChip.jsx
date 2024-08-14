import { Avatar, Chip, Typography } from "@material-tailwind/react";
import React from "react";

const CountryChip = ({ country }) => {
  return (
    <Chip
      variant="outlined"
      icon={
        <Avatar
          size="xs"
          variant="circular"
          className="h-full w-full -translate-x-0.5"
          alt="Tania Andrew"
          src={country.imgSrc}
        />
      }
      value={
        <Typography variant="small" color="black" className="font-medium capitalize leading-none">
          {country.name}
        </Typography>
      }
      className="rounded-full w-auto"
    />
  );
};

export default CountryChip;

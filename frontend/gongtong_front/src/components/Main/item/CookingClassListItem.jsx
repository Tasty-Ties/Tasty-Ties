import { Card, CardHeader, CardBody, Typography, Chip } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import CountryChip from "./CountryChip";
import { useNavigate } from "react-router-dom";

const CookingClassListItem = ({ cookingClass }) => {
  const nav = useNavigate();

  const countries = [
    { code: "KR", name: "한국어", imgSrc: "/images/countries/KR.svg" },
    { code: "US", name: "영어", imgSrc: "/images/countries/US.svg" },
    { code: "CN", name: "중국어", imgSrc: "/images/countries/CN.svg" },
    { code: "JP", name: "일본어", imgSrc: "/images/countries/JP.svg" },
    { code: "ES", name: "스페인어", imgSrc: "/images/countries/ES.svg" },
    { code: "FR", name: "프랑스어", imgSrc: "/images/countries/FR.svg" },
    { code: "DE", name: "독일어", imgSrc: "/images/countries/DE.svg" },
    { code: "RU", name: "러시아어", imgSrc: "/images/countries/RU.svg" },
    { code: "IT", name: "이탈리아어", imgSrc: "/images/countries/IT.svg" },
    { code: "PT", name: "포르투갈어", imgSrc: "/images/countries/PT.svg" },
    { code: "SA", name: "아랍어", imgSrc: "/images/countries/SA.svg" },
    { code: "IN", name: "힌디어", imgSrc: "/images/countries/IN.svg" },
    { code: "VN", name: "베트남어", imgSrc: "/images/countries/VN.svg" },
    { code: "TH", name: "태국어", imgSrc: "/images/countries/TH.svg" },
    { code: "TR", name: "터키어", imgSrc: "/images/countries/TR.svg" },
  ];

  const [country, setCountry] = useState({});

  useEffect(() => {
    countries.forEach((country) => {
      if (country.code === cookingClass.classCountry.alpha2) {
        setCountry(country);
      }
    });
  }, [cookingClass]);

  const goCookingClassDetail = () => {
    nav(`/class/${cookingClass.uuid}`);
  };

  return (
    <Card
      className="shadow-none transform transition-transform duration-300 hover:scale-[1.03] hover:cursor-pointer"
      onClick={goCookingClassDetail}
    >
      <CardBody className="h-full">
        <img
          src={cookingClass.mainImage ? cookingClass.mainImage : "/images/main/no_image.jpg"}
          alt="profile-picture"
          className="object-cover rounded-md"
          onError={(e) => {
            e.target.src = "/images/main/no_image.jpg";
          }}
        />
        <div className="flex mt-2.5">
          <CountryChip country={country} />
        </div>
        <div className="ml-1">
          <Typography
            variant="h5"
            color="blue-gray"
            className="mt-2.5 mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {cookingClass.title}
          </Typography>
          <Typography
            color="blue-gray"
            className="text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {cookingClass.hostName}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default CookingClassListItem;

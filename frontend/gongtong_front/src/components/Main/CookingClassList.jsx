import React from "react";
import { Carousel, IconButton, Typography } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import CookingClassListItem from "./item/CookingClassListItem";

const CookingClassList = () => {
  return (
    <div className="flex flex-col w-3/4 mx-auto content-center relative">
      <Typography variant="h4" className="ml-12">
        최신 등록된 강의
      </Typography>
      <Carousel
        className="h-auto px-6 flex items-center overflow-hidden"
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="gray"
            size="lg"
            onClick={handlePrev}
            className="!absolute top-2/4 left-0 transform -translate-y-2/4 rounded-full"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="gray"
            size="lg"
            onClick={handleNext}
            className="!absolute top-2/4 right-0 transform -translate-y-2/4 rounded-full"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </IconButton>
        )}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 transform -translate-x-2/4 z-20 flex gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-2 w-2 cursor-pointer rounded-full transition-all ${
                  activeIndex === i ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        <div className="grid grid-cols-4 w-full h-[90%]">
          <CookingClassListItem />
          <CookingClassListItem />
          <CookingClassListItem />
          <CookingClassListItem />
        </div>
        <div className="ml-12 grid grid-cols-4 w-full">
          <CookingClassListItem />
          <CookingClassListItem />
          <CookingClassListItem />
          <CookingClassListItem />
        </div>
      </Carousel>
    </div>
  );
};

export default CookingClassList;
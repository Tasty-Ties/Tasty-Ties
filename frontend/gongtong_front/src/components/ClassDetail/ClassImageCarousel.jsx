import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 사용자 정의 화살표 컴포넌트
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} absolute top-1/2 left-1 z-10 transform -translate-y-1/2 text-white p-5 rounded-full`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      ◀
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} absolute top-1/2 right-5 z-10 transform -translate-y-1/2 text-white p-5 rounded-full`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      ▶
    </button>
  );
};

const ClassImageCarousel = ({ classDetail }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto relative mb-8">
      <div className="overflow-hidden">
        <Slider {...settings} className="-mx-2">
          {classDetail.imageUrls &&
            classDetail.imageUrls.map((imageUrl, index) => (
              <div key={index} className="px-2">
                <div className="aspect-video bg-gray-200 rounded-2xl">
                  <img
                    src={imageUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default ClassImageCarousel;

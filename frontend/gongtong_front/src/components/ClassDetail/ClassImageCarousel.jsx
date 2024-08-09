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
  };

  return (
    <div className="container mx-auto relative w-full h-3/4 rounded-lg">
      <Slider {...settings}>
        {classDetail.imageUrls &&
          classDetail.imageUrls.map((imageUrl, index) => (
            <div key={index} className="bg-contain">
              <img
                src={imageUrl}
                alt={`Slide ${index + 2}`}
                className="w-full h-96 rounded-lg"
              />
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default ClassImageCarousel;

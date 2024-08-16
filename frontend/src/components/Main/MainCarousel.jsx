import React, { useEffect, useRef } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import MainCarouselItem from "./item/MainCarouselItem";
import CountryChip from "./item/CountryChip";
import CountryFlags from "../../common/components/CountryFlags";

const MainCarousel = () => {
  const DIVIDER_HEIGHT = 5;
  const outerDivRef = useRef();

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();

      // 스크롤 행동 구현
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = window.innerHeight;

      if (deltaY > 0) {
        // scroll down
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          // page 1
          outerDivRef.current.scrollTo({
            top: pageHeight,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          // page 2
          outerDivRef.current.scrollTo({
            top: pageHeight * 2,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
          // page 3
          outerDivRef.current.scrollTo({
            top: pageHeight * 3,
            left: 0,
            behavior: "smooth",
          });
        } else {
          // page 4
          outerDivRef.current.scrollTo({
            top: pageHeight * 3,
            left: 0,
            behavior: "smooth",
          });
        }
      } else {
        // scroll up
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          // page 1
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          // page 2
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
          // page 3
          outerDivRef.current.scrollTo({
            top: pageHeight,
            left: 0,
            behavior: "smooth",
          });
        } else {
          outerDivRef.current.scrollTo({
            top: pageHeight * 2,
            left: 0,
            behavior: "smooth",
          });
        }
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);

    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  const nav = useNavigate();

  const goMain = () => {
    nav("/");
  };

  const goSignup = () => {
    nav("/signup");
  };

  const countrySVGLists = CountryFlags.countrySVGLists;

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

  return (
    <div ref={outerDivRef} className="h-full overflow-y-auto scrollbar-hidden">
      <MainCarouselItem className="bg-first-600">
        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-col">
            <Typography variant="h1" color="white" className="font-nanum">
              맛으로 문화를 잇는 공간
            </Typography>
            <Typography variant="h1" color="white" className="font-nanum">
              맛, 잇다
            </Typography>
            <Typography variant="h6" color="white" className="mt-10 font-nanum">
              세계의 맛을 통해 문화를 잇는 '맛, 잇다'에서,
            </Typography>
            <Typography variant="h6" color="white" className="font-nanum">
              요리를 통해 나라와 나라가 소통하는 특별한 경험을 만나보세요.
            </Typography>
            <div className="flex flex-row mt-20">
              <Button variant="filled" color="white" className="mr-2 font-nanum" onClick={goMain}>
                둘러보기
              </Button>
              <Button variant="outlined" color="white" className="font-nanum" onClick={goSignup}>
                회원가입하기
              </Button>
            </div>
          </div>
          <img
            className="w-[36%] ml-16 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
            src="/images/main/메인화면.png"
            alt="nature image"
          />
        </div>
      </MainCarouselItem>
      <MainCarouselItem className="bg-white">
        <div className="flex flex-col items-center">
          <Typography variant="h1" className="font-nanum">
            요리와 소통을 음성으로 간편하게
          </Typography>
          <Typography variant="h6" className="mt-8 font-nanum">
            요리 중 손으로 채팅하기 힘들 때 음성 채팅으로 손쉽게 소통해 보세요.
          </Typography>
          <Typography variant="h6" className="font-nanum">
            손이 바쁜 상황에서도 편리하게 대화할 수 있어요.
          </Typography>
          <img
            className="w-[44%] mt-20 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
            src="/images/main/실시간클래스화면.png"
            alt="nature image"
          />
        </div>
      </MainCarouselItem>
      <MainCarouselItem className="bg-second-200">
        <div className="flex flex-col w-[48%] mx-auto items-center">
          <Typography variant="h1" className="font-nanum">
            언어 걱정 없이,
          </Typography>
          <Typography variant="h1" className="font-nanum">
            전 세계 친구들과 소통하세요
          </Typography>
          <Typography variant="h6" className="mt-8 font-nanum">
            서로 다른 언어로 채팅해도 자동 번역으로 모두가 이해할 수 있어요.
          </Typography>
          <Typography variant="h6" className="font-nanum">
            전 세계 사람들과 편하게 대화하세요!
          </Typography>
          <div className="flex flex-row mt-10 mb-12 gap-x-1 gap-y-2 flex-wrap justify-center">
            {countries.map((country) => (
              <CountryChip key={country.code} country={country} />
            ))}
          </div>
          <img
            className="object-cover object-center w-[88%]"
            src="/images/main/메신저화면.png"
            alt="nature image"
          />
        </div>
      </MainCarouselItem>
      <MainCarouselItem className="bg-third-100">
        <div className="flex flex-row">
          <div className="flex flex-col items-center">
            <Typography variant="h1" className="font-nanum">
              요리하며 쌓아가는 추억의 한 페이지
            </Typography>
            <Typography variant="h6" className="mt-8 font-nanum">
              요리 클래스 중 찍은 모든 순간을 앨범으로 저장해, 언제든지 추억을 꺼내보세요.
            </Typography>
            <Typography variant="h6" className="font-nanum">
              당신의 요리 여정이 한층 더 특별해집니다.
            </Typography>
            <img
              className="w-[44%] mt-20 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
              src="/images/main/앨범화면.png"
              alt="nature image"
            />
          </div>
        </div>
      </MainCarouselItem>
    </div>
  );
};

export default MainCarousel;

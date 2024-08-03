import axios from "axios";
import React, { useEffect, useState } from "react";

import Ingredient from "@components/ClassRegist/Ingredient";
import Recipe from "./../components/ClassRegist/Recipe";
import CookingTools from "./../components/ClassRegist/CookingTools";
import ClassImageFiles from "./../components/ClassRegist/ClassImageFile";
import CookingClassTags from "./../components/ClassRegist/CookingClassTags";
import useClassRegistStore from "./../store/ClassRegistStore";
import api from "../service/Api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import "@styles/ClassRegist/ClassRegist.css";

const ClassRegist = () => {
  const nav = useNavigate();
  const { countries, fetchCountries } = useClassRegistStore();
  const { languages, fetchLanguages } = useClassRegistStore();
  const [replayDays, setReplayDays] = useState(0);
  const [files, setFiles] = useState([]);
  const [classInformation, setClassInformation] = useState({
    title: "",
    dishName: "",
    isLimitedAge: false,
    countryCode: "",
    countryName: "",
    cookingClassTags: [],
    description: "",
    languageCode: "",
    languageName: "",
    level: 0,
    cookingClassStartTime: new Date().toISOString(),
    cookingClassEndTime: "",
    dishCookingTime: 0,
    ingredients: [],
    recipe: [],
    cookingTools: [],
    quota: 0,
    replayEndTime: "",
    isDelete: false,
  });
  const onChange = (e) => {
    // 주류 체크박스
    if (e.target.name === "isLimitedAge") {
      setClassInformation({
        ...classInformation,
        [e.target.name]: e.target.checked,
      });
      // 주류 체크박스를 제외한 나머지 값 저장
    } else if (e.target.name === "cookingClassStartTime") {
      let newStartTime = e.target.value;
      setClassInformation({
        ...classInformation,
        [e.target.name]: newStartTime,
      });
      handleReplayEndTime(replayDays);
    } else if (
      e.target.name === "countryCode" ||
      e.target.name === "languageCode"
    ) {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const dataset = selectedOption.dataset;
      console.log(dataset);
      console.log(selectedOption);
      setClassInformation({
        ...classInformation,
        [e.target.name]: e.target.value,
        [dataset.id]: dataset.value,
      });
    } else {
      setClassInformation({
        ...classInformation,
        [e.target.name]: e.target.value,
      });
    }
  };

  // 레시피 값 객체에 넣기
  const handleRecipeChange = (recipe) => {
    setClassInformation({
      ...classInformation,
      recipe: recipe,
    });
  };
  // 재료 관리
  const handleIngredientsChange = (ingredients) => {
    setClassInformation({
      ...classInformation,
      ingredients: ingredients,
    });
  };

  // 소개글 최대길이
  const MAX_LENGTH = 1000;
  const handleTextChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setClassInformation({
        ...classInformation,
        description: e.target.value,
      });
    } else {
      alert("1000글자 이내의 글만 입력 가능합니다.");
    }
  };

  const calculateReplayEndTime = (startTime, days) => {
    const defaultTime = dayjs(startTime)
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(0);
    const calculatedDate = defaultTime.add(Number(days) || 0, "day");
    const offset = new Date().getTimezoneOffset() * 60000;
    const endDay = new Date(calculatedDate.valueOf() - offset);
    return endDay.toISOString();
  };

  // 리플레이 시간 변환 및 저장
  const handleReplayEndTime = (e) => {
    const inputValue = e.target.value;
    setReplayDays(inputValue);
    const newReplayEndTime = calculateReplayEndTime(
      classInformation.cookingClassStartTime,
      inputValue
    );
    setClassInformation({
      ...classInformation,
      replayEndTime: newReplayEndTime,
    });
  };

  useEffect(() => {
    fetchCountries();
    fetchLanguages();
    console.log("classRegist useEffect : ", { classInformation });
  }, [classInformation, fetchCountries, fetchLanguages]);

  const ratings = [5, 4, 3, 2, 1];
  const setLevelValue = (e) => {
    if (e.target.checked) {
      setClassInformation({
        ...classInformation,
        level: e.target.value,
      });
    }
  };

  const setClassRegist = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    // const formData = new FormData();
    // formData.append(
    //   "classInformation",
    //   new Blob([JSON.stringify(classInformation)], { type: "application/json" })
    // );
    // for (let i = 0; i < files.length; i++) {
    //   formData.append("files", files[i]);
    // }
    try {
      // const token =
      //   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb2plb25nMzIiLCJpYXQiOjE3MjI1NTkyODQsImV4cCI6MTcyMjU1OTY0NH0.XDGNTu0bOX0ne5xc0ZdPo2q_YEOBgisXdiZyvqnDXyg";
      const response = await api.post(
        "/classes",
        // formData,
        classInformation,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log(response);
      nav("/");
    } catch (error) {
      console.error("클래스 등록 실패:", error);
    }
  };

  return (
    <div className="class-regist-container">
      <div className="class-regist-title">클래스 등록</div>
      <form encType="multipart/form-data">
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="title">클래스명</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              id="title"
              name="title"
              value={classInformation.title}
              onChange={onChange}
              placeholder="클래스명을 입력해주세요"
            />
          </div>
        </div>
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="dishName">음식명</label>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="dishName"
              id="dishName"
              value={classInformation.dishName}
              onChange={onChange}
              placeholder="음식명을 입력해주세요"
            />
          </div>
          <div className="title-box">
            <label htmlFor="isLimitedAge" />
          </div>
          <div className="input-box">
            <input
              type="checkbox"
              name="isLimitedAge"
              id="isLimitedAge"
              checked={classInformation.isLimitedAge}
              onChange={onChange}
            />
            <label htmlFor="isLimitedAge">
              성인 인증이 필요한 경우(주류 사용 등) 체크해주세요.
            </label>
          </div>
        </div>
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="countryCode">국가명</label>
          </div>
          <div className="input-box">
            <select id="countryCode" name="countryCode" onChange={onChange}>
              <option>선택</option>
              {countries &&
                countries.map((country) => (
                  <option
                    key={country.countryCode}
                    value={country.countryCode}
                    data-value={country.koreanName}
                    data-id={"countryName"}
                  >
                    {country.koreanName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <CookingClassTags
          hashtags={classInformation.cookingClassTags}
          setHashtags={(cookingClassTags) =>
            setClassInformation({ ...classInformation, cookingClassTags })
          }
        />
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="description">소개</label>
          </div>
          <div className="input-box">
            <textarea
              name="description"
              id="description"
              placeholder="클래스 소개를 입력해주세요"
              value={classInformation.description}
              onChange={handleTextChange}
            ></textarea>
            <div>
              {classInformation.description.length} / {MAX_LENGTH}
            </div>
          </div>
        </div>
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="languageCode">수업 진행할 언어</label>
          </div>
          <div className="input-box">
            <select id="languageCode" name="languageCode" onChange={onChange}>
              <option>선택</option>
              {languages &&
                languages.map((language) => (
                  <option
                    key={language.languageCode}
                    value={language.languageCode}
                    data-value={language.koreanName}
                    data-id={"languageName"}
                  >
                    {language.koreanName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="level">수업 난이도</label>
          </div>
          <div className="input-box">
            <div className="review-rating-box">
              <div className="rating">
                <div className="rating-status">
                  {ratings.map((rating, index) => (
                    <React.Fragment key={`rating-${index}`}>
                      <input
                        type="radio"
                        className="rating"
                        name="rating1"
                        value={rating}
                        id={`rate1-${rating}`}
                        onClick={setLevelValue}
                      />
                      <label htmlFor={`rate1-${rating}`}>⭐</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="cookingClassStartTime">수업일정</label>
          </div>
          <div className="input-box">
            <DateTimePicker
              label="수업 시작시간"
              value={dayjs(classInformation.cookingClassStartTime)}
              name="cookingClassStartTime"
              minDate={dayjs(new Date())}
              minTime={dayjs(new Date())}
              onChange={(value) => {
                setClassInformation({
                  ...classInformation,
                  cookingClassStartTime: value,
                });
              }}
            />
            <DateTimePicker
              label="수업 종료 시간"
              value={dayjs(classInformation.cookingClassEndTime)}
              name="cookingClassEndTime"
              minDate={dayjs(classInformation.cookingClassStartTime)}
              maxDate={dayjs(classInformation.cookingClassStartTime).add(
                1,
                "day"
              )}
              s
              onChange={(value) => {
                setClassInformation({
                  ...classInformation,
                  cookingClassEndTime: value.toISOString(),
                });
              }}
            />
          </div>
        </div>
        <ClassImageFiles />
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="dishCookingTime">조리 시간</label>
          </div>
          <div className="input-box">
            <input
              type="number"
              id="dishCookingTime"
              name="dishCookingTime"
              onChange={onChange}
            />
            <span>분</span>
          </div>
        </div>
        <Ingredient onChange={handleIngredientsChange} />
        <Recipe onChange={handleRecipeChange} />
        <CookingTools
          cookingTools={classInformation.cookingTools}
          setCookingTools={(cookingTools) =>
            setClassInformation({ ...classInformation, cookingTools })
          }
        />
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="quota">클래스 정원</label>
          </div>
          <div className="input-box">
            <input type="number" id="quota" name="quota" onChange={onChange} />
          </div>
        </div>
        <div className="regist-component-box">
          <div className="title-box">
            <label htmlFor="replayEndTime">다시보기 기간</label>
          </div>
          <div className="input-box">
            <input
              type="number"
              id="replayEndTime"
              name="replayEndTime"
              onChange={handleReplayEndTime}
            />
          </div>
        </div>
        <div className="button-box">
          <button className="cancel-box">취소</button>
          <button className="regist-box" onClick={setClassRegist}>
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassRegist;

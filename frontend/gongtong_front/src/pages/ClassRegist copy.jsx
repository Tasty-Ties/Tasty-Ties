import axios from "axios";
import React, { useEffect, useState } from "react";

import Ingredient from "./../components/ClassRegist/Ingredient";
import Recipe from "./../components/ClassRegist/Recipe";
import CookingTools from "./../components/ClassRegist/CookingTools";
import ClassImageFiles from "./../components/ClassRegist/ClassImageFile";
import CookingClassTags from "./../components/ClassRegist/CookingClassTags";
import useCookingClassStore from "../store/CookingClassStore";

import dayjs from "dayjs";

import "./../styles/ClassRegist/ClassRegist.css";
import { setClassRegist } from "../service/CookingClassAPI";
import Button from "../common/components/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const ClassRegist = () => {
  const navigate = useNavigate();
  const { countries, fetchCountries, languages, fetchLanguages } =
    useCookingClassStore((state) => ({
      countries: state.countries,
      fetchCountries: state.fetchCountries,
      languages: state.languages,
      fetchLanguages: state.fetchLanguages,
    }));
  const {
    mode: onBlur,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => console.log(data);
  const [replayDays, setReplayDays] = useState(0);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    fetchCountries();
    fetchLanguages();
  }, []);

  // const onChange = (e) => {
  //   // 주류 체크박스
  //   if (e.target.name === "isLimitedAge") {
  //     setClassInformation({
  //       ...classInformation,
  //       [e.target.name]: e.target.checked,
  //     });
  //     // 주류 체크박스를 제외한 나머지 값 저장
  //   } else if (e.target.name === "cookingClassStartTime") {
  //     let newStartTime = e.target.value;
  //     setClassInformation({
  //       ...classInformation,
  //       [e.target.name]: newStartTime,
  //     });
  //     handleReplayEndTime(replayDays);
  //   } else if (
  //     e.target.name === "countryCode" ||
  //     e.target.name === "languageCode"
  //   ) {
  //     const selectedOption = e.target.options[e.target.selectedIndex];
  //     const dataset = selectedOption.dataset;
  //     console.log(dataset);
  //     console.log(selectedOption);
  //     setClassInformation({
  //       ...classInformation,
  //       [e.target.name]: e.target.value,
  //       [dataset.id]: dataset.value,
  //     });
  //   } else {
  //     setClassInformation({
  //       ...classInformation,
  //       [e.target.name]: e.target.value,
  //     });
  //   }
  // };

  // // 레시피 값 객체에 넣기
  // const handleRecipeChange = (recipe) => {
  //   setClassInformation({
  //     ...classInformation,
  //     recipe: recipe,
  //   });
  //   console.log(recipe);
  // };
  // // 재료 관리
  // const handleIngredientsChange = (ingredients) => {
  //   setClassInformation({
  //     ...classInformation,
  //     ingredients: ingredients,
  //   });
  // };

  // // 소개글 최대길이
  // const MAX_LENGTH = 1000;
  // const handleTextChange = (e) => {
  //   if (e.target.value.length <= MAX_LENGTH) {
  //     setClassInformation({
  //       ...classInformation,
  //       description: e.target.value,
  //     });
  //   } else {
  //     alert("1000글자 이내의 글만 입력 가능합니다.");
  //   }
  // };

  const convertToSeoulTime = (date) => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localIOSTime = new Date(date - tzoffset).toISOString().slice(0, -1);
    return localIOSTime;
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
  // const handleReplayEndTime = (e) => {
  //   const inputValue = e.target.value;
  //   setReplayDays(inputValue);
  //   const newReplayEndTime = calculateReplayEndTime(
  //     classInformation.cookingClassStartTime,
  //     inputValue
  //   );
  //   setClassInformation({
  //     ...classInformation,
  //     replayEndTime: newReplayEndTime,
  //   });
  // };

  // // 별점
  // const ratings = [5, 4, 3, 2, 1];
  // const setLevelValue = (e) => {
  //   if (e.target.checked) {
  //     setClassInformation({
  //       ...classInformation,
  //       level: e.target.value,
  //     });
  //   }
  // };

  // 유효성 검사

  // 클래스 등록
  // const handleClassRegist = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await setClassRegist(classInformation, files);
  //     alert("성공");
  //     // location.replace("/class");
  //   } catch (error) {
  //     console.error("클래스 등록 실패:", error);
  //   }
  // };

  return (
    <div className="w-3/6 mx-auto justify-center">
      <div className="mt-8 mb-4 text-center text-first-800 font-bold border-b-2 border-first-800 pb-4 text-2xl">
        클래스 등록
      </div>
      <form encType="multipart/form-data">
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="title">클래스명</label>
          </div>
          <div className="col-span-6">
            <input
              type="text"
              id="title"
              name="title"
              placeholder="클래스명을 입력해주세요"
              className="w-full border p-2 rounded"
              {...register("title", {
                required: "클래스명은 필수입니다.",
                pattern: {
                  value: /^[a-zA-Z가-힣0-9\s]{1,50}$/,
                  message:
                    "클래스명은 50자 이내의 문자, 숫자만 입력 가능합니다.",
                },
              })}
              errors={errors}
            />
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="dishName">음식명</label>
          </div>
          <div className="col-span-6">
            <input
              type="text"
              name="dishName"
              id="dishName"
              value={classInformation.dishName}
              onChange={onChange}
              placeholder="음식명을 입력해주세요"
              className="w-full border p-2 rounded"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="isLimitedAge"
                id="isLimitedAge"
                checked={classInformation.isLimitedAge}
                onChange={onChange}
                className="mr-1"
              />
              <label htmlFor="isLimitedAge" className="text-gray-500 text-sm">
                성인 인증이 필요한 경우(주류 사용 등) 체크해주세요.
              </label>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="countryCode">국가명</label>
          </div>
          <div className="col-span-6">
            <select
              id="countryCode"
              name="countryCode"
              onChange={onChange}
              className="w-1/2 border p-2 rounded"
            >
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
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="hashtage">해쉬태그</label>
          </div>
          <div className="col-span-6">
            <CookingClassTags
              hashtags={classInformation.cookingClassTags}
              setHashtags={(cookingClassTags) =>
                setClassInformation({
                  ...classInformation,
                  cookingClassTags,
                })
              }
            />
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="description">소개글</label>
          </div>
          <div className="col-span-6">
            <textarea
              name="description"
              id="description"
              placeholder="클래스 소개를 입력해주세요"
              value={classInformation.description}
              onChange={handleTextChange}
              className="w-full resize-none h-48 border p-2 rounded"
            ></textarea>
            <div className="text-right text-sm text-gray-500">
              {classInformation.description.length} / {MAX_LENGTH}
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="languageCode">수업 진행할 언어</label>
          </div>
          <div className="col-span-6">
            <select
              id="languageCode"
              name="languageCode"
              onChange={onChange}
              className="w-1/2 border p-2 rounded"
            >
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
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="level">수업 난이도</label>
          </div>
          <div className="col-span-6">
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
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="cookingClassStartTime">수업일정</label>
          </div>
          <div className="col-span-6">
            <input
              aria-label="Date and time"
              type="datetime-local"
              // value={dayjs(classInformation.cookingClassStartTime)}
              name="cookingClassStartTime"
              onChange={(value) => {
                setClassInformation({
                  ...classInformation,
                  cookingClassStartTime: convertToSeoulTime(new Date(value)),
                });
              }}
            />
            <input
              aria-label="Date and time"
              type="datetime-local"
              name="cookingClassEndTime"
              onChange={(value) => {
                setClassInformation({
                  ...classInformation,
                  cookingClassEndTime: convertToSeoulTime(new Date(value)),
                });
              }}
            />
            {/* <DateTimePicker
                label="수업 시작시간"
                id="classStartTime"
                value={dayjs(classInformation.cookingClassStartTime)}
                name="cookingClassStartTime"
                minDate={dayjs(new Date())}
                minTime={dayjs(new Date())}
                onChange={(value) => {
                  setClassInformation({
                    ...classInformation,
                    cookingClassStartTime: convertToSeoulTime(new Date(value)),
                  });
                }}
              /> */}
            {/* <DateTimePicker
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
                    cookingClassEndTime: convertToSeoulTime(new Date(value)),
                  });
                }}
              /> */}
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="classImageInput">완성사진</label>
          </div>
          <div className="col-span-6">
            <ClassImageFiles setFiles={setFiles} />
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="dishCookingTime">조리 시간</label>
          </div>
          <div className="col-span-6">
            <input
              type="number"
              id="dishCookingTime"
              name="dishCookingTime"
              onChange={onChange}
              className="w-1/2 border p-2 rounded"
            />
            <span className="ml-2">분</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="">식재료</label>
            <div className="text-sm text-gray-400 mt-1">* 필수여부 체크</div>
          </div>
          <div className="col-span-6">
            <Ingredient onChange={handleIngredientsChange} />
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="">레시피</label>
            <div className="text-sm text-gray-400 mt-1">* 단계별로 작성</div>
          </div>
          <div className="col-span-6">
            {" "}
            <Recipe onChange={handleRecipeChange} />
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="cookingTools">조리도구</label>
          </div>
          <div className="col-span-6">
            <CookingTools
              cookingTools={classInformation.cookingTools}
              setCookingTools={(cookingTools) =>
                setClassInformation({ ...classInformation, cookingTools })
              }
            />
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="quota">클래스 정원</label>
          </div>
          <div className="col-span-6">
            <input
              type="number"
              id="quota"
              name="quota"
              onChange={onChange}
              className="w-1/2 border p-2 rounded"
              placeholder="클래스 정원을 입력해주세요"
            />
            <span className="ml-2">명</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="replayEndTime">다시보기 기간</label>
          </div>
          <div className="col-span-6">
            <input
              type="number"
              id="replayEndTime"
              name="replayEndTime"
              onChange={handleReplayEndTime}
              className="w-1/2 border p-2 rounded"
              placeholder="다시보기 기간을 입력해주세요"
            />
            <span className="ml-2">일</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="mt-5 flex justify-center">
          <div className="mr-2">
            <Button
              text="취소"
              type="green-border-semi-long"
              onClick={() => navigate("/class")}
            />
          </div>
          <div>
            <Button
              text="등록"
              type="green-semi-long"
              onClick={handleClassRegist}
            />
          </div>
        </div>
        <div className="h-36"></div>
      </form>
    </div>
  );
};

export default ClassRegist;

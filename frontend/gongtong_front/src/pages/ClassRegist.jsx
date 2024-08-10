import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import Ingredient from "./../components/ClassRegist/Ingredient";
import Recipe from "./../components/ClassRegist/Recipe";
import CookingTools from "./../components/ClassRegist/CookingTools";
import ClassImageFiles from "./../components/ClassRegist/ClassImageFile";
import CookingClassTags from "./../components/ClassRegist/CookingClassTags";
import useCookingClassStore from "../store/CookingClassStore";
import { setClassRegist } from "../service/CookingClassAPI";
import Button from "../common/components/Button";

import "./../styles/ClassRegist/ClassRegist.css";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required("클래스명은 필수입니다")
    .max(50, "클래스명은 50자 이내여야 합니다"),
  dishName: yup
    .string()
    .required("음식명은 필수입니다")
    .max(50, "음식명은 50자 이내여야 합니다"),
  isLimitedAge: yup.boolean(),
  countryCode: yup.string().required("음식 문화권은 필수입니다"),
  countryName: yup.string(),
  cookingClassTags: yup.array(),
  description: yup.string().required("클래스 소개는 필수입니다"),
  languageCode: yup.string().required("클래스 진행 언어는 필수입니다"),
  languageName: yup.string(),
  level: yup.number().required("난이도는 필수입니다").min(1).max(5),
  cookingClassStartTime: yup.date().required("시작 시간은 필수입니다"),
  cookingClassEndTime: yup
    .date()
    .required("종료 시간은 필수입니다")
    .min(
      yup.ref("cookingClassStartTime"),
      "종료 시간은 시작 시간 이후여야 합니다"
    )
    .test(
      "duration",
      "수업 시간은 12시간을 초과할 수 없습니다",
      function (endTime) {
        const startTime = this.parent.cookingClassStartTime;
        return dayjs(endTime).diff(startTime, "hour") <= 12;
      }
    ),
  dishCookingTime: yup
    .number()
    .positive("조리 시간은 0보다 커야 합니다")
    .required("조리 시간은 필수입니다"),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("식재료명은 필수입니다"),
        quantity: yup.string().required("수량은 필수입니다"),
        unit: yup.string().required("단위는 필수입니다"),
      })
    )
    .min(1, "최소 1개의 식재료가 필요합니다"),
  recipe: yup
    .array()
    .of(
      yup.object().shape({
        step: yup.number().required("레시피 순서는 필수입니다"),
        description: yup
          .string()
          .required("레시피 설명은 필수입니다")
          .max(500, "레시피 설명은 500자 이내여야 합니다"),
      })
    )
    .min(1, "최소 1개의 레시피 단계가 필요합니다"),
  cookingTools: yup.array().min(1, "최소 1개의 조리 도구가 필요합니다"),
  quota: yup
    .number()
    .required("클래스 정원은 필수입니다")
    .transform((value) => {
      if (value < 1) return 1;
      if (value > 5) return 5;
      return value;
    }),
  replayEndTime: yup
    .number()
    .min(1)
    .max(31)
    .required("다시보기 종료 시간은 필수입니다")
    .transform((value) => {
      if (value < 1) return 1;
      if (value > 31) return 31;
      return value;
    }),
});

const ClassRegist = () => {
  const navigate = useNavigate();
  const { countries, fetchCountries, languages, fetchLanguages } =
    useCookingClassStore();
  const [files, setFiles] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
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
      cookingClassStartTime: dayjs().format("YYYY-MM-DDTHH:mm"),
      cookingClassEndTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      dishCookingTime: 0,
      ingredients: [],
      recipe: [],
      cookingTools: [],
      quota: 1,
      replayEndTime: 1,
    },
  });

  useEffect(() => {
    fetchCountries();
    fetchLanguages();
    trigger();
  }, []);

  const memoizedCountries = useMemo(() => {
    return (
      countries &&
      countries.map((country) => (
        <option key={country.countryCode} value={country.countryCode}>
          {country.koreanName}
        </option>
      ))
    );
  }, [countries]);

  const memoizedLanguages = useMemo(() => {
    return (
      languages &&
      languages.map((language) => (
        <option key={language.languageCode} value={language.languageCode}>
          {language.koreanName}
        </option>
      ))
    );
  }, [languages]);

  const handleFormSubmit = (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작을 방지
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      // 특별한 필드들은 엔터키 동작을 허용
      if (["cookingClassTags", "cookingTools"].includes(fieldName)) {
        return;
      }
      e.preventDefault(); // 일반 필드에서는 엔터키 기본 동작을 방지
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log("제출된 데이터:", data);
    console.log("파일:", files);
    if (!isValid) {
      alert("모든 필수 항목을 올바르게 입력해주세요.");
      return;
    }
    if (files.length === 0) {
      alert("최소 한 개의 이미지를 업로드해주세요.");
      return;
    }
    try {
      await setClassRegist(data, files);
      alert("성공적으로 등록되었습니다.");
      navigate("/class");
    } catch (error) {
      console.error("클래스 등록 실패:", error);
      alert("클래스 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReplayEndTime = (days) => {
    const startTime = watch("cookingClassStartTime");
    const newReplayEndTime = calculateReplayEndTime(startTime, days);
    setValue("replayEndTime", newReplayEndTime);
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

  return (
    <div className="w-3/6 mx-auto justify-center">
      <div className="mt-8 mb-4 text-center text-first-800 font-bold border-b-2 border-first-800 pb-4 text-2xl">
        클래스 등록
      </div>
      <form
        onSubmit={handleFormSubmit}
        onChange={() => trigger()}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="title">클래스명</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="클래스명을 입력해주세요"
                  className="w-full border p-2 rounded"
                  onKeyDown={(e) => handleKeyDown(e, "title")}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="dishName">음식명</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="dishName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="음식명을 입력해주세요"
                  className="w-full border p-2 rounded"
                  onKeyDown={(e) => handleKeyDown(e, "dishName")}
                />
              )}
            />
            <div className="flex items-center mt-2">
              <Controller
                name="isLimitedAge"
                control={control}
                render={({ field }) => (
                  <input {...field} type="checkbox" className="mr-1" />
                )}
              />
              <label htmlFor="isLimitedAge" className="text-gray-500 text-sm">
                성인 인증이 필요한 경우(주류 사용 등) 체크해주세요.
              </label>
            </div>
            {errors.dishName && (
              <p className="text-red-500">{errors.dishName.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="countryCode">국가명</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-1/2 border p-2 rounded">
                  <option value="">선택</option>
                  {memoizedCountries}
                </select>
              )}
            />
            {errors.countryCode && (
              <p className="text-red-500">{errors.countryCode.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="hashtage">해시태그</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="cookingClassTags"
              control={control}
              render={({ field }) => (
                <CookingClassTags
                  hashtags={field.value}
                  setHashtags={(tags) => field.onChange(tags)}
                />
              )}
            />
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="description">소개글</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="클래스 소개를 입력해주세요"
                  className="w-full resize-none h-48 border p-2 rounded"
                  onKeyDown={(e) => handleKeyDown(e, "description")}
                />
              )}
            />
            <div className="text-right text-sm text-gray-500">
              {watch("description").length} / 1000
            </div>
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="languageCode">수업 진행할 언어</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="languageCode"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-1/2 border p-2 rounded">
                  <option value="">선택</option>
                  {memoizedLanguages}
                </select>
              )}
            />
            {errors.languageCode && (
              <p className="text-red-500">{errors.languageCode.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="level">수업 난이도</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <div className="review-rating-box">
                  <div className="rating">
                    <div className="rating-status">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <React.Fragment key={`rating-${rating}`}>
                          <input
                            type="radio"
                            className="rating"
                            name="rating1"
                            value={rating}
                            id={`rate1-${rating}`}
                            checked={field.value === rating}
                            onChange={() => field.onChange(rating)}
                          />
                          <label htmlFor={`rate1-${rating}`}>⭐</label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            />
            {errors.level && (
              <p className="text-red-500">{errors.level.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="cookingClassStartTime">수업일정</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="cookingClassStartTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className="w-1/2 px-4 py-2 mb-4 border rounded-lg shadow-sm bg-white text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-first focus:border-first"
                  onKeyDown={(e) => handleKeyDown(e, "cookingClassStartTime")}
                />
              )}
            />
            {errors.cookingClassStartTime && (
              <p className="text-red-500">
                {errors.cookingClassStartTime.message}
              </p>
            )}
            <Controller
              name="cookingClassEndTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className="w-1/2 px-4 py-2 mb-4 border rounded-lg shadow-sm bg-white text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-first focus:border-first"
                  onKeyDown={(e) => handleKeyDown(e, "cookingClassEndTime")}
                />
              )}
            />
            {errors.cookingClassEndTime && (
              <p className="text-red-500">
                {errors.cookingClassEndTime.message}
              </p>
            )}
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
            <Controller
              name="dishCookingTime"
              control={control}
              min="0"
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-1/2 border p-2 rounded"
                  onKeyDown={(e) => handleKeyDown(e, "dishCookingTime")}
                />
              )}
            />
            <span className="ml-2">분</span>
            {errors.dishCookingTime && (
              <p className="text-red-500">{errors.dishCookingTime.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="">식재료</label>
            <div className="text-sm text-gray-400 mt-1">* 필수여부 체크</div>
          </div>
          <div className="col-span-6">
            <Controller
              name="ingredients"
              control={control}
              render={({ field }) => <Ingredient onChange={field.onChange} />}
            />
            {errors.ingredients && (
              <p className="text-red-500">{errors.ingredients.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="">레시피</label>
            <div className="text-sm text-gray-400 mt-1">* 단계별로 작성</div>
          </div>
          <div className="col-span-6">
            <Controller
              name="recipe"
              control={control}
              render={({ field }) => <Recipe onChange={field.onChange} />}
            />
            {errors.recipe && (
              <p className="text-red-500">{errors.recipe.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="cookingTools">조리도구</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="cookingTools"
              control={control}
              render={({ field }) => (
                <CookingTools
                  cookingTools={field.value}
                  setCookingTools={field.onChange}
                />
              )}
            />
            {errors.cookingTools && (
              <p className="text-red-500">{errors.cookingTools.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="quota">클래스 정원</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="quota"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-1/2 border p-2 rounded"
                  min="1"
                  max="5"
                  placeholder="클래스 정원을 입력해주세요"
                  onKeyDown={(e) => handleKeyDown(e, "quota")}
                  onChange={(e) => {
                    let value = parseInt(e.target.value);
                    if (value < 1) value = 1;
                    if (value > 5) value = 5;
                    field.onChange(value);
                  }}
                />
              )}
            />
            <span className="ml-2">명</span>
            {errors.quota && (
              <p className="text-red-500">{errors.quota.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="replayEndTime">다시보기 기간</label>
          </div>
          <div className="col-span-6">
            <Controller
              name="replayEndTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-1/2 border p-2 rounded"
                  placeholder="다시보기 기간을 입력해주세요"
                  min="1"
                  max="31"
                  onKeyDown={(e) => handleKeyDown(e, "replayEndTime")}
                  onChange={(e) => {
                    let value = parseInt(e.target.value);
                    if (value < 1) value = 1;
                    if (value > 31) value = 31;
                    field.onChange(value);
                  }}
                />
              )}
            />
            <span className="ml-2">일</span>
            {errors.replayEndTime && (
              <p className="text-red-500">{errors.replayEndTime.message}</p>
            )}
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
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
        <div className="h-36"></div>
      </form>
    </div>
  );
};

export default ClassRegist;

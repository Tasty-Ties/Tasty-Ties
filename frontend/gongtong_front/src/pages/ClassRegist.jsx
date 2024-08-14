import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import Cookies from "js-cookie";

import dayjs from "dayjs";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required("클래스명은 필수입니다")
    .min(2, "클래스명은 최소 2글자입니다.")
    .max(50, "클래스명은 최대 50자입니다.")
    .matches(
      /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9\s]{1,50}$/,
      "클래스명은 한글,영어,숫자 조합만 가능합니다."
    ),
  dishName: yup
    .string()
    .required("음식명은 필수입니다")
    .max(50, "음식명은 최대 50자입니다")
    .matches(
      /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9\s]{1,50}$/,
      "음식명은 한글,영어,숫자 조합만 가능합니다."
    ),
  isLimitedAge: yup.boolean(),
  countryCode: yup.string().required("음식 문화권 선택은 필수입니다"),
  cookingClassTags: yup.array().min(1, "해시태그를 입력해주세요."),
  description: yup
    .string()
    .required("클래스 소개는 필수입니다")
    .max(200, "음식 소개는 최대 200자입니다."),
  languageCode: yup.string().required("클래스 진행 언어는 필수입니다"),
  level: yup.number().required("난이도를 설정해주세요").min(1).max(5),
  cookingClassStartTime: yup.date().required("시작 시간을 입력해주세요"),
  cookingClassEndTime: yup
    .date()
    .required("종료 시간을 입력해주세요")
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
    .required("조리 시간은 필수입니다")
    .transform((value) => {
      if (value < 0) return 1;
      return value;
    }),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        ingredientName: yup
          .string()
          .required("식재료명은 필수입니다")
          .max(50, "식재료명은 최대 50자입니다."),
        quantity: yup.number().required("수량은 필수입니다"),
        quantityUnit: yup
          .string()
          .required("단위는 필수입니다")
          .max(10, "단위는 최대 10자입니다."),
      })
    )
    .min(1, "최소 1개의 식재료가 필요합니다"),
  recipe: yup
    .array()
    .of(
      yup.object().shape({
        step: yup.number(),
        description: yup
          .string()
          .max(100, "레시피 설명은 100자 이내여야 합니다"),
      })
    )
    .min(1, "레시피를 입력해주세요"),
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
    .required("다시보기 종료 시간은 필수입니다")
    .transform((value) => {
      if (value < 1) return 1;
      if (value > 31) return 31;
      return value;
    }),
});

const ClassRegist = () => {
  let cookie = Cookies.get("accessToken");
  const navigate = useNavigate();
  const { countries, fetchCountries, languages, fetchLanguages } =
    useCookingClassStore();
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
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
      level: 1,
      cookingClassStartTime: dayjs().format("YYYY-MM-DDTHH:mm"),
      cookingClassEndTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      dishCookingTime: 1,
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
    if (!cookie) {
      navigate("/login");
    }
  }, [fetchCountries, fetchLanguages]);

  const onSubmit = async (data) => {
    const isValid = await trigger();

    if (files.length === 0) {
      alert("최소 한 개의 이미지를 업로드해주세요.");
      return;
    }

    const calculatedReplayEndTime = calculateReplayEndTime(
      data.cookingClassStartTime,
      data.replayEndTime
    );
    const calculatedStartTime = convertUTC(data.cookingClassStartTime);
    const calculatedEndTime = convertUTC(data.cookingClassEndTime);

    const updatedData = {
      ...data,
      cookingClassStartTime: calculatedStartTime,
      cookingClassEndTime: calculatedEndTime,
      replayEndTime: calculatedReplayEndTime,
    };

    console.log(updatedData);
    console.log(files);

    try {
      await setClassRegist(updatedData, files);
      navigate("/registcomplete", {
        replace: true,
        state: {
          message: "클래스 등록이 완료되었습니다.",
          classTitle: updatedData.title,
          classTime: `${updatedData.cookingClassStartTime.substring(
            0,
            10
          )} ${updatedData.cookingClassStartTime.substring(
            11,
            16
          )} ~ ${updatedData.cookingClassEndTime.substring(
            0,
            10
          )} ${updatedData.cookingClassEndTime.substring(11, 16)}`,
        },
      });
    } catch (error) {
      console.error("클래스 등록 실패:", error);
      alert("클래스 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const convertUTC = (date) => {
    const offset = new Date().getTimezoneOffset() * 60000;
    const endDay = new Date(date.valueOf() - offset);
    return endDay.toISOString();
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

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      if (["cookingClassTags", "cookingTools"].includes(fieldName)) {
        return;
      }
      e.preventDefault();
    }
  };

  return (
    <div className="w-3/6 mx-auto justify-center">
      <div className="mt-8 mb-4 text-center text-first-800 font-bold border-b-2 border-first-800 pb-4 text-2xl">
        클래스 등록
      </div>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="title">클래스명</label>
          </div>
          <div className="col-span-6">
            <input
              {...register("title")}
              type="text"
              placeholder="클래스명을 입력해주세요"
              className="w-full border p-2 rounded"
              onBlur={() => trigger("title")}
              onKeyDown={(e) => handleKeyDown(e, "title")}
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
            <input
              {...register("dishName")}
              type="text"
              placeholder="음식명을 입력해주세요"
              className="w-full border p-2 rounded"
              onBlur={() => trigger("dishName")}
              onKeyDown={(e) => handleKeyDown(e, "dishName")}
            />
            <div className="flex items-center mt-2">
              <input
                {...register("isLimitedAge")}
                type="checkbox"
                className="mr-1"
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
            <select
              {...register("countryCode")}
              className="w-1/2 border p-2 rounded"
              onChange={(e) => {
                const selectedCountry = countries.find(
                  (c) => c.countryCode === e.target.value
                );
                setValue("countryCode", e.target.value);
                setValue(
                  "countryName",
                  selectedCountry ? selectedCountry.koreanName : ""
                );
                setTimeout(() => trigger("countryCode"), 0);
              }}
            >
              <option value="">선택</option>
              {countries &&
                countries.length > 0 &&
                countries.map((country) => (
                  <option key={country.countryCode} value={country.countryCode}>
                    {country.koreanName}
                  </option>
                ))}
            </select>
            <input type="hidden" {...register("countryName")} />
            {errors.countryCode && (
              <p className="text-red-500">{errors.countryCode.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="cookingClassTags">해시태그</label>
          </div>
          <div className="col-span-6">
            <CookingClassTags
              hashtags={watch("cookingClassTags")}
              setHashtags={(tags) => {
                setValue("cookingClassTags", tags);
                trigger("cookingClassTags");
              }}
            />
            {errors.cookingClassTags && (
              <p className="text-red-500">{errors.cookingClassTags.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="description">소개글</label>
          </div>
          <div className="col-span-6">
            <textarea
              {...register("description")}
              placeholder="클래스 소개를 입력해주세요"
              className="w-full resize-none h-48 border p-2 rounded"
              onBlur={() => trigger("description")}
              onKeyDown={(e) => handleKeyDown(e, "description")}
            />
            <div className="text-right text-sm text-gray-500">
              {watch("description").length} / 250
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
            <select
              {...register("languageCode")}
              className="w-1/2 border p-2 rounded"
              onChange={(e) => {
                const selectedLanguage = languages.find(
                  (l) => l.languageCode === e.target.value
                );
                setValue("languageCode", e.target.value);
                setValue(
                  "languageName",
                  selectedLanguage ? selectedLanguage.koreanName : ""
                );
                setTimeout(() => trigger("languageCode"), 0);
              }}
            >
              <option value="">선택</option>
              {languages &&
                languages.length > 0 &&
                languages.map((language) => (
                  <option
                    key={language.languageCode}
                    value={language.languageCode}
                  >
                    {language.koreanName}
                  </option>
                ))}
            </select>
            <input type="hidden" {...register("languageName")} />
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
                        checked={watch("level") === rating}
                        onChange={() => setValue("level", rating)}
                      />
                      <label htmlFor={`rate1-${rating}`}>⭐</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
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
            <p className="text-gray-600">클래스 시작시간</p>
            <input
              {...register("cookingClassStartTime")}
              type="datetime-local"
              className="w-1/2 px-4 py-2 mb-4 border rounded-lg shadow-sm bg-white text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-first focus:border-first"
              onChange={(e) => {
                setValue("cookingClassStartTime", e.target.value);
                trigger("cookingClassStartTime");
              }}
              onKeyDown={(e) => handleKeyDown(e, "cookingClassStartTime")}
            />
            {errors.cookingClassStartTime && (
              <p className="text-red-500">
                {errors.cookingClassStartTime.message}
              </p>
            )}
            <p className="text-gray-600">클래스 종료시간</p>
            <input
              {...register("cookingClassEndTime")}
              type="datetime-local"
              className="w-1/2 px-4 py-2 mb-4 border rounded-lg shadow-sm bg-white text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-first focus:border-first"
              onChange={(e) => {
                setValue("cookingClassEndTime", e.target.value);
                trigger("cookingClassEndTime");
              }}
              onKeyDown={(e) => handleKeyDown(e, "cookingClassEndTime")}
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
            <input
              {...register("dishCookingTime")}
              type="number"
              className="w-1/2 border p-2 rounded"
              min="1"
              onBlur={() => trigger("dishCookingTime")}
              onKeyDown={(e) => handleKeyDown(e, "dishCookingTime")}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (value < 1) value = 1;
                setValue("dishCookingTime", value);
                trigger("dishCookingTime");
              }}
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
            <label htmlFor="ingredients">식재료</label>
            <div className="text-sm text-gray-400 mt-1">* 필수여부 체크</div>
          </div>
          <div className="col-span-6">
            <Ingredient
              onChange={(ingredients) => {
                setValue("ingredients", ingredients);
                trigger("ingredients");
              }}
            />
            {errors.ingredients && (
              <p className="text-red-500">{errors.ingredients.message}</p>
            )}
          </div>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-8">
          <div className="col-span-2">
            <label htmlFor="recipe">레시피</label>
            <div className="text-sm text-gray-400 mt-1">* 단계별로 작성</div>
          </div>
          <div className="col-span-6">
            <Recipe
              onChange={(recipe) => {
                setValue("recipe", recipe);
                trigger("recipe");
              }}
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
            <CookingTools
              cookingTools={watch("cookingTools")}
              setCookingTools={(tools) => {
                setValue("cookingTools", tools);
                trigger("cookingTools");
              }}
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
            <input
              {...register("quota")}
              type="number"
              className="w-1/2 border p-2 rounded"
              min="1"
              max="5"
              placeholder="클래스 정원을 입력해주세요"
              onBlur={() => trigger("quota")}
              onKeyDown={(e) => handleKeyDown(e, "quota")}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (value < 1) value = 1;
                if (value > 5) value = 5;
                setValue("quota", value);
              }}
            />
            <span className="ml-2">명</span>
            {errors.quota && (
              <p className="text-red-500">{errors.quota.message}</p>
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
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="h-36"></div>
      </form>
    </div>
  );
};

export default ClassRegist;

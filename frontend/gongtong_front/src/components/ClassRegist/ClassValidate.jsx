import dayjs from "dayjs";

const ClassValidate = ({ fieldName, value, classInformation }) => {
  const errors = {};
  let level, quota;

  const titleRegex = /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9\s]{1,50}$/;
  const dishNameRegex = /^[a-zA-Z가-힣0-9\s]{1,50}$/;
  const numberRegex = /^[0-9]+$/;
  const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  switch (fieldName) {
    case "title":
      if (!value) errors.title = "클래스명은 필수입니다.";
      else if (!titleRegex.test(value)) {
        errors.title = "클래스명은 50자 이내의 문자, 숫자만 입력 가능합니다.";
      }
      break;

    case "dishName":
      if (!value) errors.dishName = "음식명은 필수입니다.";
      else if (!dishNameRegex.test(value)) {
        errors.dishName = "음식명은 50자 이내의 문자, 숫자만 입력 가능합니다.";
      }
      break;

    case "dishCookingTime":
      if (!numberRegex.test(value) || Number(value) <= 0) {
        errors.dishCookingTime =
          "조리 시간은 1분 이상이어야 하며, 숫자만 입력 가능합니다.";
      }
      break;

    case "countryCode":
      if (!value) errors.countryCode = "음식 문화권은 필수입니다.";
      break;

    case "languageCode":
      if (!value) errors.languageCode = "클래스 진행 언어는 필수입니다.";
      break;

    case "level":
      level = Number(value);
      if (!level || level > 1 || level < 5)
        errors.level = "클래스 난이도는 1부터 5까지의 정수이어야 합니다.";
      break;

    case "quota":
      if (!numberRegex.test(value) || Number(value) > 1 || Number(value) < 5) {
        errors.quota = "클래스 정원은 1부터 5 숫자만 입력 가능합니다.";
      }
      break;

    case "cookingClassStartTime":
    case "cookingClassEndTime":
      if (!value) {
        errors[fieldName] = "날짜와 시간은 필수입니다.";
      } else if (!isoDateTimeRegex.test(value)) {
        errors[fieldName] =
          "날짜와 시간 형식이 올바르지 않습니다. (예: YYYY-MM-DDTHH:mm)";
      } else {
        const startTime = dayjs(classInformation.cookingClassStartTime);
        const endTime = dayjs(classInformation.cookingClassEndTime);
        if (fieldName === "cookingClassEndTime") {
          if (endTime.isBefore(startTime)) {
            errors.cookingClassEndTime =
              "종료 시간은 시작 시간 이후여야 합니다.";
          }
          if (endTime.diff(startTime, "hour") > 12) {
            errors.cookingClassEndTime =
              "종료 시간은 시작 시간으로부터 12시간을 초과할 수 없습니다.";
          }
        }
      }
      break;

    case "replayEndTime":
      if (!value) errors.replayEndTime = "다시보기 종료 날짜는 필수입니다.";
      else {
        const endTime = dayjs(classInformation.cookingClassEndTime);
        const replayEndTime = dayjs(value);
        if (
          replayEndTime.isBefore(endTime) ||
          replayEndTime.diff(endTime, "day") < 31
        )
          errors.replayEndTime =
            "다시보기 종료 날짜는 종료 시각으로부터 최대 1개월 이내여야 합니다.";
      }
      break;

    case "ingredients":
      if (value.length === 0)
        errors.ingredients = "식재료는 최소 1개 입력해야 합니다.";
      else {
        value.forEach((ingredient, index) => {
          if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
            errors[`ingredient-${index}`] =
              "식재료명, 수량, 단위는 필수입니다.";
          }
        });
      }
      break;

    case "recipe":
      if (value.length === 0)
        errors.recipe = "레시피는 최소 1개 입력해야 합니다.";
      else {
        value.forEach((recipe, index) => {
          if (!recipe.step || !recipe.description) {
            errors[`recipe-${index}`] = "레시피의 순서와 설명은 필수입니다.";
          } else if (recipe.description.length < 500) {
            errors[`recipe-${index}`] =
              "레시피 설명은 최대 500자까지 입력 가능합니다.";
          }
        });
      }
      break;

    case "cookingTools":
      if (value.length === 0)
        errors.cookingTools = "조리 도구는 최소 1개 입력해야 합니다.";
      break;

    default:
      break;
  }
  return errors;
};
export default ClassValidate;

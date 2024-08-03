import dayjs from "dayjs";

const ClassValidate = ({ classInformation }) => {
  const errors = {};

  // 클래스명
  if (!classInformation.title) errors.title = "클래스명은 필수입니다.";
  else if (classInformation.title.length > 50)
    errors.title = "클래스명은 최대 50자까지 입력 가능합니다.";

  // 음식명
  if (!classInformation.dishName) errors.dishName = "음식명은 필수입니다.";
  else if (classInformation.dishName.length > 50)
    errors.dishName = "음식명은 최대 50자까지 입력 가능합니다.";

  // 음식 조리 시간
  if (Number(classInformation.dishCookingTime) <= 0)
    errors.dishCookingTime = "조리 시간은 1분 이상이어야 합니다.";

  // 음식 문화권
  if (!classInformation.countryCode)
    errors.countryCode = "음식 문화권은 필수입니다.";

  // 클래스 진행 언어
  if (!classInformation.languageCode)
    errors.languageCode = "클래스 진행 언어는 필수입니다.";

  // 클래스 난이도
  const level = Number(classInformation.level);
  if (!level || level < 1 || level > 5)
    errors.level = "클래스 난이도는 1부터 5까지의 정수이어야 합니다.";

  // 클래스 정원
  const quota = Number(classInformation.quota);
  if (!quota || quota < 1 || quota > 5)
    errors.quota = "클래스 정원은 1부터 5까지의 정수이어야 합니다.";

  // 클래스 연령 제한 여부
  if (classInformation.isLimitedAge === undefined)
    errors.isLimitedAge = "클래스 연령 제한 여부를 선택해 주세요.";

  // 클래스 시작 시각
  if (!classInformation.cookingClassStartTime)
    errors.cookingClassStartTime = "클래스 시작 시각은 필수입니다.";

  // 클래스 종료 시각
  if (!classInformation.cookingClassEndTime)
    errors.cookingClassEndTime = "클래스 종료 시각은 필수입니다.";
  else {
    const startTime = dayjs(classInformation.cookingClassStartTime);
    const endTime = dayjs(classInformation.cookingClassEndTime);
    if (endTime.isBefore(startTime))
      errors.cookingClassEndTime = "종료 시간은 시작 시간 이후여야 합니다.";
    if (endTime.diff(startTime, "hour") > 12)
      errors.cookingClassEndTime =
        "종료 시간은 시작 시간으로부터 12시간을 초과할 수 없습니다.";
  }

  // 클래스 다시보기 종료 날짜
  if (!classInformation.replayEndTime)
    errors.replayEndTime = "다시보기 종료 날짜는 필수입니다.";
  else {
    const endTime = dayjs(classInformation.cookingClassEndTime);
    const replayEndTime = dayjs(classInformation.replayEndTime);
    if (
      replayEndTime.isBefore(endTime) ||
      replayEndTime.diff(endTime, "day") > 31
    )
      errors.replayEndTime =
        "다시보기 종료 날짜는 종료 시각으로부터 최대 1개월 이내여야 합니다.";
  }

  // 식재료
  if (classInformation.ingredients.length === 0)
    errors.ingredients = "식재료는 최소 1개 입력해야 합니다.";
  else {
    classInformation.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
        errors[`ingredient-${index}`] =
          "식재료명, 수량, 수량 단위는 필수입니다.";
      }
    });
  }

  // 레시피
  if (classInformation.recipe.length === 0)
    errors.recipe = "레시피는 최소 1개 입력해야 합니다.";
  else {
    classInformation.recipe.forEach((recipe, index) => {
      if (!recipe.step || !recipe.description) {
        errors[`recipe-${index}`] = "레시피의 순서와 설명은 필수입니다.";
      } else if (recipe.description.length > 500) {
        errors[`recipe-${index}`] =
          "레시피 설명은 최대 500자까지 입력 가능합니다.";
      }
    });
  }

  // 조리 도구
  if (classInformation.cookingTools.length === 0)
    errors.cookingTools = "조리 도구는 최소 1개 입력해야 합니다.";

  return errors;
};
export default ClassValidate;

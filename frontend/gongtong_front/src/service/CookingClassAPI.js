import api from "./Api";

// 국적
export const getCountries = async () => {
  try {
    const response = await api.get("/countries");
    return response.data.data.countries;
  } catch (error) {
    console.log("CookingClassAPI - getCountriesError : " + error);
  }
};

// 언어
export const getLanguages = async () => {
  try {
    const response = await api.get("/languages");
    return response.data.data.languages;
  } catch (error) {
    console.log("CookingClassAPI - getLanguagesError : " + error);
  }
};

// 클래스 목록
export const getClassLists = async (page) => {
  try {
    const response = await api.get("/classes", {
      params: {
        page: page,
        size: 12,
      },
    });
    return response.data.data.content;
  } catch (error) {
    console.log("CookingClassAPI - getClassListsError : " + error);
  }
};

// 클래스 상세
export const getClassDetail = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}`);
    return response.data.data;
  } catch (error) {
    console.log("CookingClassAPI - getClassDetailError : " + error);
  }
};

// 클래스 예약
export const setClassReservation = async (id) => {
  try {
    await api.post(`/classes/reservation/${id}`);
  } catch (error) {
    console.log("CookingClassAPI - setClassReservationError : " + error);
  }
};

// 클래스 예약 취소
export const setDeleteClassReservation = async (id) => {
  try {
    await api.delete(`/classes/reservation/${id}`, null);
  } catch (error) {
    console.log("CookingClassAPI - setDeleteClassReservation : " + error);
  }
};

// 클래스 삭제
export const setDeleteClass = async (id) => {
  try {
    api.delete(`classes/${id}`, null);
  } catch (error) {
    console.log("CookingClassAPI - setDeleteClass : " + error);
  }
};

// 클래스 등록
export const setClassRegist = async (classInformation, files) => {
  console.log(classInformation);
  console.log(files);
  const formData = new FormData();
  formData.append(
    "registerDto",
    new Blob([JSON.stringify(classInformation)], { type: "application/json" })
  );
  files.forEach((file) => {
    formData.append("images", file);
  });
  try {
    await api.post("/classes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log("CookingClassAPI - setClassRegist : " + error);
  }
};

// 클래스 리뷰
export const getClassReviews = async (id) => {
  try {
    const response = await api.get(`/classes/${id}/reviews`);
    // console.log(response.data.data.content[0]);
    return response.data.data.content;
  } catch (error) {
    console.log("CookingClassAPI - setDeleteClassReservation : " + error);
  }
};

export const getSearchLists = async (page) => {
  try {
    const response = await api.get("/classes", {
      params: {
        page: page,
        size: 12,
      },
    });
    return response.data.data.content;
  } catch (error) {
    console.log("CookingClassAPI - getClassListsError : " + error);
  }
};
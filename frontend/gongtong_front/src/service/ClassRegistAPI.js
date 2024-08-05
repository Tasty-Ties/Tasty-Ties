import axios from "./Axios";
import Axios from "axios";

// 국적
export const getCountries = async () => {
  try {
    const response = await axios.get("/countries");
    return response.data.data.countries;
  } catch (error) {
    console.log("ClassRegistAPI - getCountriesError : " + error);
  }
};

// 언어
export const getLanguages = async () => {
  try {
    const response = await axios.get("/languages");
    return response.data.data.languages;
  } catch (error) {
    console.log("ClassRegistAPI - getLanguagesError : " + error);
  }
};

// 클래스 목록
export const getClassLists = async (page) => {
  try {
    const response = await axios.get("/classes", {
      params: {
        page: page,
        size: 12,
      },
    });
    return response.data.data.content;
  } catch (error) {
    console.log("ClassListsAPI - getClassListsError : " + error);
  }
};

// 클래스 상세
export const getClassDetail = async (classId) => {
  try {
    const response = await axios.get(`/classes/${classId}`);
    return response.data.data;
  } catch (error) {
    console.log("ClassDetailAPI - getClassDetailError : " + error);
  }
};

// 클래스 예약
export const setClassReservation = async (id) => {
  try {
    await axios.post(`/classes/reservation/${id}`);
  } catch (error) {
    console.log("setClassReservation - setClassReservationError : " + error);
  }
};

// 클래스 예약 취소
export const setDeleteClassReservation = async (id) => {
  try {
    await axios.delete(`/classes/reservation/${id}`, null);
  } catch (error) {
    console.log(
      "setDeleteClassReservation - setDeleteClassReservation : " + error
    );
  }
};

// 클래스 삭제
export const setDeleteClass = async (id) => {
  try {
    axios.delete(`classes/${id}`, null);
  } catch (error) {
    console.log("setDeleteClass - setDeleteClass : " + error);
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
    await axios.post("/classes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log("setClassRegist - setClassRegist : " + error);
  }
};

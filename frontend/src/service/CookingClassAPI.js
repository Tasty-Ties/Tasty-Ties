import { pushApiErrorNotification } from "../components/common/Toast";
import api from "./Api";

// 국적
export const getCountries = async () => {
  try {
    const response = await api.get("/countries");
    const sortedCountries = response.data.data.countries.sort((a, b) => {
      return a.koreanName.localeCompare(b.koreanName, "ko", {
        sensitivity: "base",
      });
    });
    return sortedCountries;
  } catch (e) {
    pushApiErrorNotification(e);
    return [];
  }
};

// 언어
export const getLanguages = async () => {
  try {
    const response = await api.get("/languages");
    const sortedLanguages = response.data.data.languages.sort((a, b) => {
      return a.koreanName.localeCompare(b.koreanName, "ko", {
        sensitivity: "base",
      });
    });
    return sortedLanguages;
  } catch (e) {
    pushApiErrorNotification(e);
    return [];
  }
};

// 클래스 목록
export const getClassLists = async (page, searchParams = {}) => {
  try {
    const response = await api.get("/classes", {
      params: {
        ...searchParams,
        page,
        size: 12,
      },
    });
    return response.data.data.content;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 클래스 상세
export const getClassDetail = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}`);
    return response.data.data;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 클래스 예약
export const setClassReservation = async (id) => {
  try {
    const response = await api.post(`/classes/reservation/${id}`);
    return response;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 클래스 예약 취소
export const setDeleteClassReservation = async (id) => {
  try {
    const response = await api.delete(`/classes/reservation/${id}`, null);
    return response;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 클래스 삭제
export const setDeleteClass = async (id) => {
  try {
    const response = api.delete(`classes/${id}`, null);
    return response;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 클래스 등록
export const setClassRegist = async (data, files) => {
  const formData = new FormData();
  formData.append(
    "registerDto",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  for (const file of files) {
    formData.append("images", file);
  }
  try {
    const response = await api.post("/classes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 클래스 리뷰
export const getClassReviews = async (id) => {
  try {
    const response = await api.get(`/classes/${id}/reviews`);
    return response.data.data.content;
  } catch (e) {
    pushApiErrorNotification(e);
  }
};

// 최신 클래스 목록 조회
export const getLatestClasses = () =>
  api.get(`/classes?page=0&size=8&sort=createTime,desc`);

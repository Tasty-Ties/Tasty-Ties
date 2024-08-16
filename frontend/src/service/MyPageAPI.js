import api from "./Api";
import { pushApiErrorNotification } from "../components/common/Toast";

// 나의 정보
export const getMyInfo = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data.data;
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 회원 탈퇴
export const deleteId = async () => {
  try {
    await api.delete("/users/me");
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 수업할 클래스
export const getTeachClass = async (page = 1, size = 4) => {
  try {
    const response = await api.get(
      `/users/me/hosting?page=${page - 1}&size=${size}`
    );
    return {
      classes: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 예약한 클래스
export const getReserveClass = async (page = 1, size = 4) => {
  try {
    const response = await api.get(
      `/users/me/reservations?page=${page - 1}&size=${size}`
    );
    return {
      classes: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 참여한 클래스
export const getAttendClass = async (page = 1, size = 4) => {
  try {
    const response = await api.get(
      `/users/me/participated?page=${page - 1}&size=${size}`
    );
    return {
      classes: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 이미지 업로드
export const imageUpload = async (formData) => {
  try {
    await api.patch("/users/me/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 마일리지
export const getMileageLog = async (month) => {
  try {
    const response = await api.get(`/users/me/activity-point?period=${month}`);
    return response.data.data;
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

import api from "./Api";
import { pushApiErrorNotification } from "../components/common/Toast";

// 다른 사람 정보
export const getOtherInfo = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}`);
    return response.data.data;
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 진행한 클래스
export const getTeachedClass = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}/hosting`);
    return response.data.data;
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 참여한 클래스
export const getAttendedClass = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}/participated`);
    return response.data.data;
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

// 수강평
export const getReview = async (username, page = 1, size = 4) => {
  try {
    const response = await api.get(
      `users/profile/${username}/reviews?page=${page - 1}&size=${size}`
    );
    return {
      reviews: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    pushApiErrorNotification(error);
  }
};

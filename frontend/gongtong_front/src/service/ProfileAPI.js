import api from "./Api";

// 다른 사람 정보
export const getOtherInfo = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// 진행한 클래스
export const getTeachedClass = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}/hosting`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// 참여한 클래스
export const getAttendedClass = async (username) => {
  try {
    const response = await api.get(`/users/profile/${username}/participated`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// 수강평
export const getReview = async (username, page = 1, size = 4) => {
  try {
    const response = await api.get(
      `users/profile/${username}/reviews?page=${page - 1}&size=${size}`
    );
    console.log(response);
    return {
      reviews: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    console.log(error);
  }
};

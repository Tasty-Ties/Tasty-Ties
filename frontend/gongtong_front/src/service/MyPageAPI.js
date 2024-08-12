import api from "./Api";

// 나의 정보
export const getMyInfo = async () => {
  try {
    const response = await api.get("/users/me");
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// 회원 탈퇴
export const deleteId = async () => {
  try {
    const response = await api.delete("/users/me");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

// 수업할 클래스
export const getTeachClass = async (page = 1, size = 4) => {
  try {
    const response = await api.get(
      `/users/me/hosting?page=${page - 1}&size=${size}`
    );
    console.log(response);
    return {
      classes: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    console.log(error);
  }
};

// 예약한 클래스
export const getReserveClass = async (page = 1, size = 4) => {
  try {
    const response = await api.get(
      `/users/me/reservations?page=${page - 1}&size=${size}`
    );
    console.log(response);
    return {
      classes: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    console.log(error);
  }
};

// 참여한 클래스
export const getAttendClass = async (page = 1, size = 4) => {
  try {
    const response = await api.get(
      `/users/me/participated?page=${page - 1}&size=${size}`
    );
    console.log(response);
    return {
      classes: response.data.data.content,
      totalItems: response.data.data.totalElements,
    };
  } catch (error) {
    console.log(error);
  }
};

// 이미지 업로드
export const imageUpload = async (formData) => {
  try {
    const response = await api.patch("/users/me/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      alert("프로필 이미지가 성공적으로 업데이트되었습니다.");
    } else {
      alert("프로필 이미지 업데이트에 실패했습니다.");
    }
  } catch (error) {
    console.error("업로드 중 오류 발생:", error);
    alert("업로드 중 오류가 발생했습니다.");
  }
};

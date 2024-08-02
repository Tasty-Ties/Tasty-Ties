import axios from "axios";
import Cookies from "js-cookie";
import useAuthStore from "../store/AuthStore";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // 실제 API URL로 변경
  withCredentials: true, // 쿠키를 포함하여 요청
  headers: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { logout } = useAuthStore();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");

      try {
        const { data } = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          {
            refreshToken: refreshToken,
          }
        );

        Cookies.set("accessToken", data.data.accessToken);
        console.log(data.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${Cookies.get(
          "accessToken"
        )}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        // 필요 시 로그아웃 처리
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;

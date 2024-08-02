import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080/api/v1";

// 요청 인터셉터: 모든 요청에 `accessToken` 추가
axios.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 403 응답을 처리하여 새로운 `accessToken` 발급
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          { refreshToken: Cookies.get("refreshToken") },
          { withCredentials: true }
        );
        console.log("새로운 엑세스 토큰 발급 성공:", response.data);

        const accessToken = response.data.data.accessToken;

        Cookies.set("accessToken", accessToken);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (err) {
        console.error("리프레시 토큰을 사용한 액세스 토큰 재발급 실패:", err);
        // 필요한 경우 로그아웃 처리 등을 수행
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

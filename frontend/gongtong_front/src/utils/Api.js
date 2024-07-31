import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // 실제 API URL로 변경
  withCredentials: true, // 쿠키를 포함하여 요청
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  console.log("Request Headers:", config.headers); // 헤더 확인
  return config;
});

export default api;

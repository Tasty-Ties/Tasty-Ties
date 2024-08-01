import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  baseURL: "http://localhost:8080/api/v1", // 실제 API URL로 변경
  login: (accessToken, refreshToken) =>
    set({
      isAuthenticated: true,
      accessToken,
      refreshToken,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    }),
}));

export default useAuthStore;

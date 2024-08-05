import { create } from "zustand";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  login: (accessToken, refreshToken) =>
    set({
      isAuthenticated: true,
      accessToken,
      refreshToken,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      accessToken: Cookies.remove("accessToken"),
      refreshToken: Cookies.remove("refreshToken"),
    }),
}));

export default useAuthStore;

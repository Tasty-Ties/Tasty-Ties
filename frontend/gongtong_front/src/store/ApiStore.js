import { create } from "zustand";

const useApiStore = create((set) => ({
  baseURL: "http://localhost:8080/api/v1",
  setBaseURL: (url) => set({ baseURL: url }),
}));

export default useApiStore;

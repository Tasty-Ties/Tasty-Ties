import { create } from "zustand";
import { getMyInfo } from "../service/MyPageAPI";

const useMyPageStore = create((set) => ({
  informations: [],
  fetchInformations: async () => {
    const informations = await getMyInfo();
    set({ informations });
  },
}));

export default useMyPageStore;

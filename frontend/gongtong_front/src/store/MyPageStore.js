import { create } from "zustand";
import { getMyInfo, getteachClass } from "../service/MyPageAPI";

const useMyPageStore = create((set) => ({
  informations: [],
  fetchInformations: async () => {
    const informations = await getMyInfo();
    set({ informations });
  },

  teachClasses: [],
  fetchTeachClasses: async () => {
    const teachClasses = await getteachClass();
    set({ teachClasses });
  },
}));

export default useMyPageStore;

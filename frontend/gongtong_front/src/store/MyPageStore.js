import { create } from "zustand";
import {
  getMyInfo,
  getTeachClass,
  getReserveClass,
} from "../service/MyPageAPI";

const useMyPageStore = create((set) => ({
  informations: [],
  fetchInformations: async () => {
    const informations = await getMyInfo();
    set({ informations });
  },

  teachClasses: [],
  fetchTeachClasses: async () => {
    const teachClasses = await getTeachClass();
    set({ teachClasses });
  },

  reserveClasses: [],
  fetchReserveClasses: async () => {
    const reserveClasses = await getReserveClass();
    set({ reserveClasses });
  },
}));

export default useMyPageStore;

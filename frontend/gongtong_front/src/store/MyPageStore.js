import { create } from "zustand";
import {
  getMyInfo,
  getTeachClass,
  getReserveClass,
  getAttendClass,
} from "../service/MyPageAPI";

const useMyPageStore = create((set) => ({
  informations: [],
  fetchInformations: async () => {
    const informations = await getMyInfo();
    set({ informations });
  },

  teachClasses: [],
  fetchTeachClasses: async (page = 1, size = 4) => {
    const { classes, totalItems } = await getTeachClass(page, size);
    set({ teachClasses: classes, totalItems });
  },

  reserveClasses: [],
  fetchReserveClasses: async (page = 1, size = 4) => {
    const { classes, totalItems } = await getReserveClass(page, size);
    set({ reserveClasses: classes, totalItems });
  },

  attendClasses: [],
  fetchAttendClasses: async (page = 1, size = 4) => {
    const { classes, totalItems } = await getAttendClass(page, size);
    set({ attendClasses: classes, totalItems });
  },
}));

export default useMyPageStore;

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
  fetchTeachClasses: async () => {
    const teachClasses = await getTeachClass();
    set({ teachClasses });
  },

  reserveClasses: [],
  fetchReserveClasses: async () => {
    const reserveClasses = await getReserveClass();
    set({ reserveClasses });
  },

  attendClasses: [],
  fetchAttendClasses: async () => {
    const attendClasses = await getAttendClass();
    set({ attendClasses });
  },
}));

export default useMyPageStore;

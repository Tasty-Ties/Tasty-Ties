import { create } from "zustand";
import {
  getMyInfo,
  getTeachClass,
  getReserveClass,
  getAttendClass,
  getMileageLog,
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

  // 참여한 클래스 중에서 endTime이 지난 것만 filter
  attendClasses: [],
  fetchAttendClasses: async (page = 1, size = 4) => {
    const { classes, totalItems } = await getAttendClass(page, size);
    const filteredClasses = classes.filter((attendClass) => {
      return new Date(attendClass.endTime).getTime() < new Date().getTime();
    });
    set({ attendClasses: filteredClasses, totalItems });
  },

  mileageLogs: [],
  fetchMileageLogs: async (month) => {
    const mileageLogs = await getMileageLog(month);
    set({ mileageLogs });
  },
}));

export default useMyPageStore;

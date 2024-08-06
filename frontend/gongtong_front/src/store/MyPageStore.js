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
    // 클래스의 끝나는 시간이 지나지 않은 것만 filter
    const filteredTeachClasses = teachClasses.filter((teachClass) => {
      return new Date(teachClass.endTime).getTime() > new Date().getTime();
    });
    set({ teachClasses: filteredTeachClasses });
  },

  reserveClasses: [],
  fetchReserveClasses: async () => {
    const reserveClasses = await getReserveClass();
    const filteredReverseClasses = reserveClasses.filter((reserveClass) => {
      return new Date(reserveClass.endTime).getTime() > new Date().getTime();
    });
    set({ reserveClasses: filteredReverseClasses });
  },
}));

export default useMyPageStore;

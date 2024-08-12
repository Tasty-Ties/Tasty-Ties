import { create } from "zustand";
import {
  getOtherInfo,
  getTeachedClass,
  getAttendedClass,
} from "../service/ProfileAPI";
import { getMileageLog } from "../service/MyPageAPI";

const useProfileStore = create((set) => ({
  otherInformations: [],
  fetchOtherInformations: async (username) => {
    const otherInformations = await getOtherInfo(username);
    set({ otherInformations });
  },

  teachedClasses: [],
  fetchTeachedClasses: async (username) => {
    const teachedClasses = await getTeachedClass(username);
    set({ teachedClasses });
  },

  attendedClasses: [],
  fetchAttendedClasses: async (username) => {
    const attendedClasses = await getAttendedClass(username);
    set({ attendedClasses });
  },
}));

export default useProfileStore;

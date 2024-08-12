import { create } from "zustand";
import {
  getOtherInfo,
  getTeachedClass,
  getAttendedClass,
  getReview,
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

  reviews: [],
  fetchReviews: async (username, page = 1, size = 4) => {
    const { reviews, totalItems } = await getReview(username, page, size);
    set({ reviews: reviews, totalItems });
  },
}));

export default useProfileStore;

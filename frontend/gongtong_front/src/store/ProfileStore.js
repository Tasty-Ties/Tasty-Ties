import { create } from "zustand";
import { getOtherInfo } from "../service/ProfileAPI";

const useProfileStore = create((set) => ({
  otherInformations: [],
  fetchOtherInformations: async (username) => {
    const otherInformations = await getOtherInfo(username);
    set({ otherInformations });
  },
}));

export default useProfileStore;

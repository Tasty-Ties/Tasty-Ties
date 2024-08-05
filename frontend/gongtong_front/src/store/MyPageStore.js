import { create } from "zustand";
import { getMyInfo } from "../service/MyPageAPI";

const useMyPageStore = create((set) => {
  const fetchInformations = async () => {
    const informations = await getMyInfo();
    set({ informations });
  };

  fetchInformations();

  return {
    informations: [],
    fetchInformations,
  };
});

export default useMyPageStore;

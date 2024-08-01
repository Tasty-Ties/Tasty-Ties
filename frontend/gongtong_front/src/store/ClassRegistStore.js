import { create } from "zustand";
import { getCountries, getLanguages } from "./../Service/ClassRegistAPI";

const useClassRegistStore = create((set) => ({
  contries: [],
  fetchCountries: async () => {
    const countries = await getCountries();
    set({ countries });
  },

  languages: [],
  fetchLanguages: async () => {
    const languages = await getLanguages();
    set({ languages });
  },
}));

export default useClassRegistStore;

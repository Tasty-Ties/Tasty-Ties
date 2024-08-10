import { create } from "zustand";
import {
  getCountries,
  getLanguages,
  getClassLists,
  getClassDetail,
  getClassReviews,
} from "./../service/CookingClassAPI";

const useCookingClassStore = create((set) => ({
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

  classLists: [],
  hasMoreContent: true,
  fetchClassLists: async (page, searchParams) => {
    const classLists = await getClassLists(page, searchParams);
    if (classLists.length === 0) {
      set({ hasMoreContent: false });
    } else {
      set((state) => ({
        classLists:
          page === 0 ? classLists : [...state.classLists, ...classLists],
      }));
    }
  },

  classDetail: {},
  fetchClassDetail: async (classId) => {
    const classDetail = await getClassDetail(classId);
    set({ classDetail });
  },

  classReviews: [],
  fetchClassReviews: async (id) => {
    const classReviews = await getClassReviews(id);
    set({ classReviews });
  },

  classSearchLists: [],
  fetchSearchLists: async () => {
    const classSearchLists = await getSearchLists();
    set({ classSearchLists });
  },

  getClassLists: async (page, searchParams) => {
    const classLists = await getClassLists(page, searchParams);
    return classLists;
  },
}));

export default useCookingClassStore;

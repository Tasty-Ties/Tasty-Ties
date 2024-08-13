import { create } from "zustand";
import { getRankingList } from "./../service/RankingAPI";

const useRankingStore = create((set) => ({
  topRanking: [],

  fetchRankingData: async (sort) => {
    const response = await getRankingList(sort, 1);
    const topRanking = response.rankedUsers.slice(0, 3);
    set({
      topRanking,
    });
  },
}));

export default useRankingStore;

import { create } from "zustand";
import { getRankingList } from "./../service/RankingAPI";

const useRankingStore = create((set) => ({
  topRanking: [],

  fetchRankingData: async (sort) => {
    const response = await getRankingList(sort, 1);
    let topRanking;
    if (response.rankedUsers.length >= 3) {
      topRanking = response.rankedUsers.slice(0, 3);
    } else if (response.rankedUsers.length === 2) {
      topRanking = response.rankedUsers.slice(0, 2);
    } else {
      topRanking = response.rankedUsers.slice(0, 1);
    }
    set({
      topRanking,
    });
  },
}));

export default useRankingStore;

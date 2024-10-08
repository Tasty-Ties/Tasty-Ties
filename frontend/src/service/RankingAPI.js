import { pushApiErrorNotification } from "../components/common/Toast";
import api from "./Api";

// 앨범 목록
export const getRankingList = async (sort, page) => {
  try {
    const response = await api.get(`/ranking/${sort}`, {
      params: {
        page: page,
      },
    });
    return response.data.data;
  } catch (error) {
    pushApiErrorNotification(e);
    return [];
  }
};

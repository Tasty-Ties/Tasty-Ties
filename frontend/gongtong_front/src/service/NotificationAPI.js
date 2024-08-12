import api from "./Api";

// 알림 가져오기
export const getNotifications = (pgNo) => api.get(`/notifications?pgNo=${pgNo}`);

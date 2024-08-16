import api from "./Api";

// 알림 가져오기
export const getNotifications = (pgNo) => api.get(`/notifications?pgNo=${pgNo}`);

// 알림 전체 지우기
export const deleteNotifications = (ids) =>
  api.delete(`notifications?notificationIds=${ids.join(",")}`);

// 알림 체크 표시하기
export const changeIsReadNotification = (id) => api.patch(`notifications?notificationId=${id}`);

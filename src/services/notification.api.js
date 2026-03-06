import api from "../lib/axios";

// 로그인 한 사용자의 알림 조회
export async function getNotifications() {
  const res = await api.get("/notifications");

  return res.data;
}

// 알림 클릭 시 읽음 처리
export async function markNotificationAsRead(notificationId) {
  const res = await api.patch(`/notifications/${notificationId}`);

  return res.data;
}

import api from "../lib/axios";

export async function getPopupReservation(popupId) {
  const res = await api.get(`/popup/reservation/${popupId}`);
  return res;
}

export async function postPopupReservation(reservationPayload) {
  const res = await api.post(`/popup/reservation`, reservationPayload);

  return res;
}

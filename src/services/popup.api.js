import api from "../lib/axios";

// home

export async function getPopups() {
  const res = await api.get("/popup");
  return res.data;
}

export async function getRandomPopups() {
  const res = await api.get("/popup/random");
  return res.data;
}

// detail api

export async function getPopupDetail(popupId) {
  const res = await api.get(`/popup/detail/${popupId}`);
  return res.data;
}

// reservation

export async function getUserReservations() {
  const res = await api.get(`/popup/reservation`);
  return res.data;
}

export async function getPopupReservation(popupId) {
  const res = await api.get(`/popup/reservation/${popupId}`);
  return res.data;
}

export async function postPopupReservation(reservationPayload) {
  const res = await api.post(`/popup/reservation`, reservationPayload);

  return res.data;
}

// manager

export async function getManagerPopups() {
  const res = await api.get("/popup/manager");
  return res.data;
}

export async function getReservationManage(popupId, filters = {}) {
  const res = await api.get(`/popup/reservationManage/${popupId}`, {
    params: filters,
  });

  return res.data;
}

// popup create

export async function postNewPopup(formData) {
  const res = await api.post("/popup", formData);

  return res.data;
}

// popup update

export async function updatePopup(formData) {
  const res = await api.patch(`/popup`, formData);

  return res.data;
}

// popup status update

export async function earlyClosePopup(data) {
  const res = await api.patch("/popup/early-close", data);

  return res.data;
}

export async function cancelPopup(data) {
  const res = await api.patch("/popup/cancel-popup", data);

  return res.data;
}

export async function cancelUserReservation(data) {
  const res = await api.patch("/popup/cancel-user", data);

  return res.data;
}

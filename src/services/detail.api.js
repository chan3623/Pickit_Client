import api from "../lib/axios";

export async function getPopupOperation(popupId) {
  const res = await api.get(`/popup/operation/${popupId}`);
  return res;
}

export async function getPopup(popupId) {
  const res = await api.get(`/popup/${popupId}`);
  return res;
}

export async function getPopupDetail(popupId) {
  const res = await api.get(`/popup/detail/${popupId}`);
  return res;
}

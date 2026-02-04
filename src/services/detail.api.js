import api from "../utils/axios";

export async function getPopupOperation(popupId) {
  const res = await api.get(`/popup/operation/${popupId}`);
  return res;
}

export async function getPopup(popupId) {
  const res = await api.get(`/popup/${popupId}`);
  return res;
}

export async function getPopupDescription(popupId) {
  const res = await api.get(`/popup/detail/${popupId}`);
  return res;
}

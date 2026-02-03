import api from "../utils/axios";

export async function getPopupOperation(popupId) {
  const res = await api.get(`http://localhost:3000/popup/operation/${popupId}`);
  return res;
}

export async function getPopup(popupId) {
  const res = await api.get(`http://localhost:3000/popup/${popupId}`);
  return res;
}
import api from "../utils/axios";

export async function getUser() {
  const res = await api.get(`/user/me`);
  return res;
}


export async function getUserReservations(){
  const res = await api.get(`/user/reservation`);
  return res;
}
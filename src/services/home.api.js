import api from "../lib/axios";

export async function getPopups() {
  const res = await api.get("/popup");
  return res;
}

export async function getRandomPopups() {
  const res = await api.get("/popup/random");
  return res;
}

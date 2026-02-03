import api from "../utils/axios";

export async function getPopups() {
  const res = await api.get("http://localhost:3000/popup");
  return res;
}

export async function getRandomPopups() {
  const res = await api.get("http://localhost:3000/popup/random");
  return res;
}

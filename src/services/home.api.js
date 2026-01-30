import api from "../utils/axios";

export async function getPopups() {
  const res = await api.get("http://localhost:3000/popup");
  return res;
}

import api from "../utils/axios";

export async function login({ id, password }) {
  const res = await api.post("http://localhost:3000/login", { id, password });
  return res;
}

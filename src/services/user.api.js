import api from "../lib/axios";

export async function registerUser({ email, password }) {
  const res = await api.post("/user", { email, password });
  return res.data;
}

export async function registerAdmin({ email, password }) {
  const res = await api.post("/user/admin", { email, password });
  return res.data;
}

export async function getUser() {
  const res = await api.get(`/user/me`);
  return res.data;
}

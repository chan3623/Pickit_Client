import api from "../lib/axios";

export async function registerUser({ email, password }) {
  return api.post("/user", { email, password });
}

export async function registerAdmin({ email, password }) {
  return api.post("/user/admin", { email, password });
}

export async function getUser() {
  const res = await api.get(`/user/me`);
  return res;
}
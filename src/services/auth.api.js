import api from "../utils/axios";

export async function registerUser({ email, password }) {
  return api.post("/user", { email, password });
}

export async function registerAdmin({ email, password }) {
  return api.post("/user/admin", { email, password });
}

export async function login({ email, password }) {
  const token = btoa(`${email}:${password}`);

  return api.post(
    "/auth/login",
    {},
    {
      headers: {
        Authorization: `Basic ${token}`,
      },
    },
  );
}

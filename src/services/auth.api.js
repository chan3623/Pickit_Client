import api from "../lib/axios";

export async function login({ email, password, loginType }) {
  const token = btoa(`${email}:${password}`);

  const res = await api.post(
    "/auth/login",
    {},
    {
      headers: {
        Authorization: `Basic ${token}`,
        "X-Login-Type": loginType,
      },
    },
  );
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");

  return res.data;
}

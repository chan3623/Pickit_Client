import api from "../lib/axios";

export async function login({ email, password, loginType }) {
  const token = btoa(`${email}:${password}`);

  return api.post(
    "/auth/login",
    {},
    {
      headers: {
        Authorization: `Basic ${token}`,
        "X-Login-Type": loginType
      },
    },
  );
}

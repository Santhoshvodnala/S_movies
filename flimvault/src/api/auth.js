import API from "./axios";

/* ---------------- REGISTER ---------------- */
export const registerUser = async (payload) => {
  // payload must match UserRequest DTO
  const res = await API.post("/api/auth/register", payload);
  return res.data?.data ?? res.data;
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (payload) => {
  const res = await API.post("/api/auth/login", payload);

  const data = res.data?.data ?? res.data ?? {};
  const token = data.token ?? null;

  if (!token) {
    throw new Error("Login failed: token not returned");
  }

  return {
    token,
    user: data.user ?? null,
    raw: res.data,
  };
};

/* ---------------- LOGIN + STORE TOKEN ---------------- */
export const loginAndStore = async (payload) => {
  const { token, user, raw } = await loginUser(payload);

  localStorage.setItem("token", token);

  return { token, user, raw };
};

/* ---------------- FETCH CURRENT USER ---------------- */
export const fetchMe = async () => {
  const res = await API.get("/api/auth/me");
  return res.data?.data ?? res.data;
};

export const googleLoginBackend = (idToken) =>
  API.post("/api/auth/google", { idToken });

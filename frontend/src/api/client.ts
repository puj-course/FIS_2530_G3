// src/api/client.ts
import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});
export const setToken = (t?: string) => {
  if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
  else delete api.defaults.headers.common.Authorization;
};
// opcional: manejar 401 global
api.interceptors.response.use(
  r => r,
  e => {
    if (e?.response?.status === 401) {
      localStorage.removeItem("token");
      setToken(undefined);
      // window.location.href = "/login"; // si quieres redirigir
    }
    return Promise.reject(e);
  }
);

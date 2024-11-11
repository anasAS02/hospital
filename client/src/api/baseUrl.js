import axios from "axios";
const api = axios.create({ baseURL: "https://hospital-psi-two.vercel.app" });
export const BASE_URL = "https://hospital-psi-two.vercel.app";
export default api;

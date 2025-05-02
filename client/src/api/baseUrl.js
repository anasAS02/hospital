import axios from "axios";

export const BASE_URL = 'https://hospital-psi-two.vercel.app';

const api = axios.create({ baseURL: BASE_URL });

export default api;

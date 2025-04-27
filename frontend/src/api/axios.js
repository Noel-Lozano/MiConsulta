import axios from 'axios';

// 👇 IMPORTANT: use the container name, not localhost
const API_URL = process.env.MI_CONSULTA_API_URL || "http://backend:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;

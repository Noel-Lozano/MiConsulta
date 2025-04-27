import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://backend:8000",

  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

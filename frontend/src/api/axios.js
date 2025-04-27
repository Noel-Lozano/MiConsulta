import axios from 'axios';

const API_URL = "http://backend:8000"; 


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        // You can add default Authorization headers here too if you have JWT tokens later
    }
});

export default api;

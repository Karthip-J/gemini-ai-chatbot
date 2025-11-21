import axios from 'axios';

// Render backend URL
const API_URL = 'https://gemini-ai-chatbot-xpn2.onrender.com';

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

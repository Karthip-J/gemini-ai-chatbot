import axios from "axios";

let BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Normalize: remove trailing slash if any
if (BASE_URL.endsWith("/")) {
  BASE_URL = BASE_URL.slice(0, -1);
}

console.log("Using API base URL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;

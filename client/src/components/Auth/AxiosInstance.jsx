import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:4000", // adjust if needed
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
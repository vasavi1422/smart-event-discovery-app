import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Attach token correctly
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token"); // ✅ FIXED

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handler
API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("❌ API ERROR:", error?.response?.data || error.message);

    // ✅ Auto logout if token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
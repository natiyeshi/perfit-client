import axios from "axios";
import Cookies from "js-cookie";

const localApi = "http://localhost:4040/api/v1/"
const mainApi = "https://51.20.191.52/api/v1/"

const instance = axios.create({
  baseURL: mainApi,
});


instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

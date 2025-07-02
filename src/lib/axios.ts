import axios from "axios";
import Cookies from "js-cookie";

const localApi = "http://localhost:4040/api/v1/"
// const mainApi = "https://159.69.214.45/api/v1/"
const mainApi = "https://backend.perfitpharma.com/"


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

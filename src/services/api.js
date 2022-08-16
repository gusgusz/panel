import axios from "axios";

import { getCurrentUserToken, setCurrentUser } from "helpers/Utils";
import { loginUser, loginUserSuccess, logoutUser } from "redux/actions";

const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({ baseURL });

api.interceptors.request.use(
  async config => {
    config.headers.Authorization = "bearer " + (await getCurrentUserToken());
    return config;
  },
  error => {
    return false;
  },
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error?.response?.status && error?.response?.status == 401) {
      logoutUser();
      await setCurrentUser(null);
      window.location.href = "/usuario";
    } else if (error?.response?.status && error?.response?.status === 422) {
    }
    return Promise.reject(error);
  },
);

export default api;

const apiMicroService = axios.create({ baseURL: process.env.REACT_APP_API_DBDIRETO_URL });
apiMicroService.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    return false;
  },
);

export { apiMicroService, baseURL };

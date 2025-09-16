import axios from "axios";

const cepApi = axios.create({ baseURL: "https://viacep.com.br/ws" });

cepApi.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return false;
  },
);

export default cepApi;

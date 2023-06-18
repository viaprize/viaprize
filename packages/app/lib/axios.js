import axios from "axios";

const axio = axios.create({
  baseURL: 'https://api.pactsmith.com/api',
});

axio.interceptors.request.use((config) => {
  return config;
});

axio.interceptors.response.use((response) => {
  return response.data;
});

export default axio;

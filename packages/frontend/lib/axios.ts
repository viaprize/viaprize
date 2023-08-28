import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Axios instance with base URL configured.
 */

const myAxios: AxiosInstance = axios.create({
  baseURL: "https://api.pactsmith.com/api",
});

/**
 * Axios request interceptor.
 * Logs the HTTP request to the console.
 * @param config - The request configuration.
 * @returns The modified request configuration.
 */
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log(`${config.method?.toUpperCase()} ${config.url}`);
  // Important: request interceptors must return the request.
  return config;
});

/**
 * Axios response interceptor.
 * Extracts the response data from the HTTP response.
 * @param response - The HTTP response.
 * @returns The response data.
 */
axios.interceptors.response.use((response: AxiosResponse) => {
  return response.data;
});

export default myAxios;

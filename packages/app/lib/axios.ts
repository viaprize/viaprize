import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Axios instance with base URL configured.
 */

//Check if NETWORK_TYPE is set to "testnet" or "mainnet" in Env
const NETWORK_TYPE = process.env.NEXT_PUBLIC_NETWORK_TYPE;
if (!NETWORK_TYPE) {
  throw new Error('NETWORK_TYPE is not set in .env');
}
const myAxios: AxiosInstance = axios.create({
  baseURL: 'https://api.pactsmith.com/api',
  headers: {
    'Network-Type': NETWORK_TYPE,
  },
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

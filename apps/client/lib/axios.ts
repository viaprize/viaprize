import { env } from "@env";
import { getAccessToken } from "@privy-io/react-auth";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { toast } from "sonner";

/**
 * Axios instance with base URL configured.
 */

// Check if NETWORK_TYPE is set to "testnet" or "mainnet" in Env

const NETWORK_TYPE = env.NEXT_PUBLIC_NETWORK_TYPE;
if (!NETWORK_TYPE) {
  throw new Error("NETWORK_TYPE is not set in .env");
}

// Function to get the access token or show an error toast
const getAccessTokenWithFallback = async (): Promise<string | null> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error("You are logged out"); // Show an error toast if no access token
    }
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

const myAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Network-Type": "mainnet",
    "Access-Control-Allow-Origin": "*",
  },
});

// Axios request interceptor with access token
myAxios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  console.log(`${config.method?.toUpperCase()} ${config.url}`);

  const accessToken = await getAccessTokenWithFallback();
  console.log("accessToken", accessToken);

  if (accessToken) {
    config.headers = config.headers || {}; // Initialize headers if they are undefined
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

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

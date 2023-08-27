import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import config from "@/config";

/**
 * Axios instance with base URL configured.
 */
const axio: AxiosInstance = axios.create({
  baseURL: config.backendURL,
});

/**
 * Axios response interceptor to handle error responses.
 */
axio.interceptors.response.use((res: AxiosResponse) => {
  if (res.data.code !== 200) {
    toast.error(res.data.msg);
  }
  return res.data;
});
// TODO: Convert the any datatype to accurate data type
/**
 * Object containing guardian-related API endpoints.
 */
const guardian = {
  /**
   * Signs a recovery record.
   * @param params - The parameters for the API request.
   * @returns A Promise representing the API response.
   */
  sign: (params: any) => axio.post("/update-recovery-record", params),

  /**
   * Retrieves pending recovery records.
   * @param params - The parameters for the API request.
   * @returns A Promise representing the API response.
   */
  getPending: (params: any) =>
    axio.post("/get-pending-recovery-record", params),

  /**
   * Retrieves signed recovery records.
   * @param params - The parameters for the API request.
   * @returns A Promise representing the API response.
   */
  getSigned: (params: any) => axio.post("/get-signed-recovery-record", params),
};

/**
 * Object containing recover-related API endpoints.
 */
const recover = {
  /**
   * Retrieves recovery records by operation hash.
   * @param opHash - The operation hash.
   * @returns A Promise representing the API response.
   */
  getByOp: (opHash: string) => axio.get(`/recovery-record/guardian/${opHash}`),

  /**
   * Adds a signature to a recovery record.
   * @param params - The parameters for the API request.
   * @returns A Promise representing the API response.
   */
  addSignature: (params: any) =>
    axio.post(`/recovery-record/guardian/${params.opHash}`, params),
};

/**
 * Object containing email-related API endpoints.
 */
const email = {
  /**
   * Adds an email to the email list.
   * @param params - The parameters for the API request.
   * @returns A Promise representing the API response.
   */
  add: (params: any) => axio.post("/add-to-list", params),
};

export default {
  guardian,
  recover,
  email,
};

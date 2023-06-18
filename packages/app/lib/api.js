import axios from "axios";
import { toast } from "react-toastify";
import config from "@/config";

const axio = axios.create({
  baseURL: config.backendURL,
});

// axio.interceptors.request.use(async (config) => {
//   config.headers.authorization = await getLocalStorage("authorization");
//   return config;
// });

axio.interceptors.response.use((res) => {
  if (res.data.code !== 200) {
    toast.error(res.data.msg);
  }
  return res.data;
});

const guardian = {
  sign: (params) => axio.post("/update-recovery-record", params),
  getPending: (params) => axio.post("/get-pending-recovery-record", params),
  getSigned: (params) => axio.post("/get-signed-recovery-record", params),
};

const recover = {
  getByOp: (opHash) => axio.get(`/recovery-record/guardian/${opHash}`),
  addSignature: (params) => axio.post(`/recovery-record/guardian/${params.opHash}`, params)
}

const email = {
  add: (params) => axio.post("/add-to-list", params),
};
export default {
  guardian,
  recover,
  email,
};

import { useQuery,useMutation } from "react-query";
import axios from "axios";
import myAxios from "@/lib/axios";

const addProsposal = async (data:Proposal) => {
    const response = await myAxios.post("/prizes/proposals", data);
    return response.data;
}

export const useAddProposal = () => {
    return useMutation(addProsposal);
}
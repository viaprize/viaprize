// import { useQuery, useMutation } from 'react-query';
// import axios from 'axios';
// import myAxios from '@/lib/axios';
import { CreatePrizeProposalDto } from '@/backend/prizes/dto/create-prize-proposal.dto';
import { makeStorageClient } from '@/components/_providers/web3client';
import myAxios from '@/lib/axios';
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

function objectToRecord(obj: { [key: string]: any }): Record<string, string> {
    return Object.entries(obj).reduce((record, [key, value]) => {
        record[key] = value.toString();
        return record;
    }, {} as Record<string, string>);
}

async function storeFiles(files: File[]) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with cid:', cid);
    const url = `https://dweb.link/ipfs/${cid}/${files[0].name}`;
    console.log('URL of the uploaded image:', url);
    return url;
}

// const addProsposal = async (data: Proposal) => {

//   const finalData = {
//       ...data,
//       // files: await storeFiles(data.files),
//       files: ''
//       };
//   const response = await myAxios.post('/prizes/proposals', finalData);

//   return response.data;

//   // const files = await storeFiles(data.files);
//   // return files;

// };

// export const useAddProposal = () => {
//   return useMutation(addProsposal);
// };


export default function usePrizeProposal() {
    const [proposals, setProposals] = useState<PrizeProposals[]>()
    const { user } = usePrivy()
    const addProposals = async (proposalDto: CreatePrizeProposalDto) => {

        const res = await myAxios.post('/prizes/proposals', { ...proposalDto },)
        return res
    }

    const uploadImages = async (files: File[]) => {
        const images = await storeFiles(files)
        return images
    }


    const getProposalsOfUser = async (queryParams: PrizeProposalQueryParams = {
        limit: 10,
        page: 1
    }) => {
        const record: Record<string, string> = objectToRecord(queryParams);
        const queryString = new URLSearchParams(record)
        if (!user) {
            // throw new Error('Privy User not available')
            return
        }
        const res = await myAxios.get(`/prizes/proposals/user/${user?.id}${queryString.toString()}`)
        console.log("res", "acxi0", res)
        return res.data as PrizeProposalsList
    }

    const getAllProposals = async (queryParam: PrizeProposalQueryParams = {
        limit: 10,
        page: 1
    }) => {
        const record: Record<string, string> = objectToRecord(queryParam);
        const queryString = new URLSearchParams(record)
        const res = await myAxios.get(`/prizes/proposals?${queryString.toString()}`)
        console.log({ res }, "proposals")
        return res.data as PrizeProposalsList
    }

    const acceptProposal = async (proposalId: string) => {
        const res = await myAxios.post(`/prizes/proposals/${proposalId}/accept`)
        return res.data
    }
    const rejectProposal = async ({ comment, proposalId }: { proposalId: string, comment: string }) => {
        const res = await myAxios.post(`/prizes/proposals/${proposalId}/reject`, { comment })
        return res.data
    }

    return {
        addProposals,
        uploadImages,
        proposals,
        getProposalsOfUser,
        getAllProposals,
        acceptProposal,
        rejectProposal
    }


}
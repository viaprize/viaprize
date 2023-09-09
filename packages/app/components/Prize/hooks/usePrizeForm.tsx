import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import myAxios from '@/lib/axios';
import { makeStorageClient } from '@/components/_providers/web3client';

async function storeFiles(files: File[]) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log('stored files with cid:', cid);
  const url = `https://dweb.link/ipfs/${cid}/${files[0].name}`;
  console.log('URL of the uploaded image:', url);
  return url;
}

const addProsposal = async (data: Proposal) => {
    
  const finalData = {
      ...data,
      files: await storeFiles(data.files),
      };
  const response = await myAxios.post('/prizes/proposals', finalData);
  
  return response.data;

  // const files = await storeFiles(data.files);
  // return files;
  
};

export const useAddProposal = () => {
  return useMutation(addProsposal);
};

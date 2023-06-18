import useWeb3Context from '@/context/hooks/useWeb3Context';

import axios from 'axios';
import Erc721Abi from './abi/ERC721.json';

const formatIPFS = (val) => {
  if (!val) {
    return val;
  }
  if (val.indexOf('ipfs://') > -1) {
    return val.replace('ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    return val;
  }
};

export default function useERC721Contract() {
  const { account, sendTx, web3 } = useWeb3Context();

  return {
    async isApprovedForAll(nftAddress, spender) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);

      return await contract.methods.isApprovedForAll(account, spender).call();
    },
    async transferFrom(nftAddress, toAddress, tokenId) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);
      const func = contract.methods.transferFrom(account, toAddress, tokenId);
      sendTx(func);
    },
    async setApprovalForAll(nftAddress, spender) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);

      const func = contract.methods.setApprovalForAll(spender, true);
      return await sendTx(func);
    },
    async tokenURI(nftAddress, id) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);

      return await contract.methods.tokenURI(id).call();
    },
    async balanceOf(nftAddress) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);

      const balance = await contract.methods.balanceOf(account).call();
      return balance;
    },
    async getNftInfo(nftAddress, tokenId) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);

      const tokenURIRaw = await contract.methods.tokenURI(tokenId).call();

      const tokenURI = formatIPFS(tokenURIRaw);
      const res = (await axios.get(tokenURI)).data;
      // const res = {"name":"ChaChaSwapPassTest","image":"ipfs://bafybeiflkkftflvs7hszhsqhhb7lqimoiinc4o5ootnjwpsv7jltrnkona","external_url":"","attributes":[],"description":"test nft # 15"}
      res.imageUri = formatIPFS(res.image);
      res.name = res.name.replace(/#\d*$/, '');
      return res;
    },
    async getName(nftAddress) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);
      return await contract.methods.name().call();
    },
    async mint(nftAddress, to, tokenId) {
      const contract = new web3.eth.Contract(Erc721Abi, nftAddress);

      const func = contract.methods.mint(to, tokenId);
      return await sendTx(func);
    },
  };
}

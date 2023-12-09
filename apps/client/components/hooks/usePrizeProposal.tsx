import { storeFiles } from '@/context/tools';
import { CreatePrizeProposalDto, PrizeProposals } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { useState } from 'react';


interface PrzieQuery {
  limit: number;
  page: number;
}

export default function usePrizeProposal() {
  const [proposals] = useState<PrizeProposals[]>();

  const addProposals = async (proposalDto: CreatePrizeProposalDto) => {
    const res = await (await backendApi()).prizes.proposalsCreate(proposalDto);
    return res;
  };

  const uploadImages = async (files: File[]) => {
    const images = await storeFiles(files);
    return images;
  };

  const getProposalsOfUser = async (
    queryParams: { limit: number; page: number } = {
      limit: 10,
      page: 1,
    },
    username: string,
  ) => {
    const res = await (
      await backendApi()
    ).prizes.proposalsUserDetail(username, queryParams);
    console.log('res', 'acxi0', res);
    return res.data.data;
  };

  const getAllProposals = async (
    queryParam: PrzieQuery = {
      limit: 10,
      page: 1,
    },
  ) => {
    const res = await (
      await backendApi()
    ).prizes.proposalsList({
      limit: queryParam.limit,
      page: queryParam.page,
    });
    console.log({ res });
    console.log(res.data.data);
    return res.data.data;
  };

  const acceptProposal = async (proposalId: string) => {
    const res = await (await backendApi()).prizes.proposalsAcceptCreate(proposalId);
    return res.data;
  };
  const rejectProposal = async ({
    comment,
    proposalId,
  }: {
    proposalId: string;
    comment: string;
  }) => {
    console.log('loggg reject');
    const res = await (
      await backendApi()
    ).prizes.proposalsRejectCreate(proposalId, {
      comment,
    });
    console.log({ res }, 'res isn ajfslj');
    return res.data;
  };

  const getAcceptedProposals = async (
    queryParam: PrzieQuery = {
      limit: 10,
      page: 1,
    },
  ) => {
    const res = await (
      await backendApi()
    ).prizes.proposalsAcceptList({
      limit: queryParam.limit,
      page: queryParam.page,
    });
    console.log({ res });
    console.log(res.data.data);
    return res.data.data;
  };
  return {
    addProposals,
    uploadImages,
    proposals,
    getProposalsOfUser,
    getAllProposals,
    acceptProposal,
    rejectProposal,
    getAcceptedProposals,
  };
}

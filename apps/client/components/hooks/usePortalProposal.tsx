import type {
  CreatePortalProposalDto,
  PortalProposals,
  UpdatePortalPropsalDto,
} from '@/lib/api';
import { backendApi } from '@/lib/backend';
import type { Query } from '@/lib/types';
import { storeFiles } from '@/lib/utils';
import { useState } from 'react';

export default function usePortalProposal() {
  const [proposals] = useState<PortalProposals[]>();

  const addProposals = async (proposalDto: CreatePortalProposalDto) => {
    const res = await (await backendApi()).portals.proposalsCreate(proposalDto);
    return res;
  };

  const deleteProposal = async (id: string) => {
    const res = await (await backendApi()).portals.proposalDeleteDelete(id);
    return res;
  };

  const getProposalById = async (id: string) => {
    const res = await (await backendApi()).portals.proposalsDetail(id);
    return res.data;
  };

  const updateProposal = async ({
    id,
    dto,
  }: {
    id: string;
    dto: UpdatePortalPropsalDto;
  }) => {
    const res = await (await backendApi()).portals.proposalsPartialUpdate(id, dto);
    return res.data;
  };

  const uploadImages = async (files: File[]) => {
    const images = await storeFiles(files);
    console.log({ images });
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
    ).portals.proposalsUserDetail(username, queryParams);
    console.log('res', 'acxi0', res);
    return res.data.data;
  };

  const getAllProposals = async (
    queryParam: Query = {
      limit: 20,
      page: 1,
    },
  ) => {
    const res = await (
      await backendApi()
    ).portals.proposalsList({
      limit: queryParam.limit,
      page: queryParam.page,
    });
    console.log({ res });
    console.log(res.data.data);
    return res.data.data;
  };

  const acceptProposal = async (proposalId: string) => {
    const res = await (await backendApi()).portals.proposalsAcceptCreate(proposalId);
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
    ).portals.proposalsRejectCreate(proposalId, {
      comment,
    });
    console.log({ res }, 'res isn ajfslj');
    return res.data;
  };

  const getAcceptedProposals = async (
    queryParam: Query = {
      limit: 10,
      page: 1,
    },
  ) => {
    const res = await (
      await backendApi()
    ).portals.proposalsAcceptList({
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
    updateProposal,
    getProposalById,
    deleteProposal,
  };
}

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { env } from '@env';

export interface Http200Response {
  message: string;
}

export interface CreatePortalDto {
  address: string;
  proposal_id: string;
}

export interface Portals {
  id: string;
  description: string;
  slug: string;
  sendImmediately: boolean;
  fundingGoal?: string;
  fundingGoalWithPlatformFee?: string;
  isMultiSignatureReciever: boolean;
  /** @format date-time */
  deadline: string;
  allowDonationAboveThreshold: boolean;
  termsAndCondition: string;
  proposer_address: string;
  contract_address: string;
  treasurers: string[];
  tags: string[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  images: string[];
  title: string;
  updates?: string[];
  comments?: PortalsComments[];
  user: User;
}

export interface PortalsComments {
  id: string;
  comment: string;
  likes: string[];
  dislikes: string[];
  /** @format date-time */
  created_at: string;
  reply_count: number;
  parentComment: PortalsComments;
  childComments: PortalsComments[];
  user: User;
  portal: Portals;
}

export interface User {
  id: string;
  email: string;
  bio: string;
  authId: string;
  name: string;
  avatar: string;
  username: string;
  isAdmin: boolean;
  proficiencies: string[];
  priorities: string[];
  walletAddress: string;
  submissions: Submission[];
  prizeProposals: PrizeProposals[];
  prizeComments: PrizesComments[];
  portalComments: PortalsComments[];
  prizes: Prize[];
  portals: Portals[];
  portalProposals: PortalProposals[];
}

export interface Submission {
  id: string;
  submissionDescription: string;
  submissionHash: string;
  submitterAddress: string;
  /** @format date-time */
  created_at: string;
  user: User;
  prize: Prize;
}

export interface Prize {
  id: string;
  description: string;
  isAutomatic: boolean;
  submissionTime: number;
  votingTime: number;
  /** @format date-time */
  startVotingDate: string;
  /** @format date-time */
  startSubmissionDate: string;
  proposer_address: string;
  contract_address: string;
  admins: string[];
  judges?: string[];
  proficiencies: string[];
  priorities: string[];
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  images: string[];
  title: string;
  stage: PrizeStages;
  contestants: User[];
  submissions: Submission[];
  comments?: PrizesComments[];
  slug: string;
  user: User;
}

export enum PrizeStages {
  NotStarted = 'not started',
  SubmissionStarted = 'submission started',
  SubmissionEnded = 'submission ended',
  VotingStarted = 'voting started',
  VotingEnded = 'voting ended',
  PrizeDistributed = 'prize distributed',
  PrizeEnded = 'prize ended',
}

export interface PrizesComments {
  id: number;
  comment: string;
  user: User;
  prize: Prize;
}

export interface PrizeProposals {
  id: string;
  voting_time: number;
  submission_time: number;
  admins: string[];
  judges?: string[];
  /** The Columns here are not part of the smart contract */
  isApproved: boolean;
  isRejected: boolean;
  title: string;
  description: string;
  isAutomatic: boolean;
  /** @format date-time */
  startVotingDate: string;
  /** @format date-time */
  startSubmissionDate: string;
  platformFeePercentage: number;
  proposerFeePercentage: number;
  proficiencies: string[];
  priorities: string[];
  images: string[];
  user: User;
}

export interface PortalProposals {
  id: string;
  description: string;
  slug: string;
  fundingGoal?: string;
  fundingGoalWithPlatformFee?: string;
  isMultiSignatureReciever: boolean;
  /** @format date-time */
  deadline: string;
  sendImmediately: boolean;
  allowDonationAboveThreshold: boolean;
  termsAndCondition: string;
  proposerAddress: string;
  treasurers: string[];
  tags: string[];
  platformFeePercentage: number;
  isApproved: boolean;
  isRejected: boolean;
  rejectionComment: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  images: string[];
  title: string;
  user: User;
}

/** Make all properties in T readonly */
export interface ReadonlyType {
  data: PortalWithBalance[];
  hasNextPage: boolean;
}

export interface PortalWithBalance {
  balance: number;
  isActive: boolean;
  totalFunds?: number;
  totalRewards?: number;
  contributors?: Contributions;
  id: string;
  description: string;
  slug: string;
  sendImmediately: boolean;
  fundingGoal?: string;
  fundingGoalWithPlatformFee?: string;
  isMultiSignatureReciever: boolean;
  /** @format date-time */
  deadline: string;
  allowDonationAboveThreshold: boolean;
  termsAndCondition: string;
  proposer_address: string;
  contract_address: string;
  treasurers: string[];
  tags: string[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  images: string[];
  title: string;
  updates?: string[];
  comments?: PortalsComments[];
  user: User;
}

export interface Contributions {
  data: Contribution[];
}

export interface Contribution {
  contributor: string;
  amount: string;
  donationTime: string;
}

export interface CreateCommentDto {
  comment: string;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO1 {
  data: PortalProposals[];
  hasNextPage: boolean;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO2 {
  data: PortalProposals[];
  hasNextPage: boolean;
}

export interface CreatePortalProposalDto {
  description: string;
  fundingGoal?: string;
  isMultiSignatureReciever: boolean;
  sendImmediately: boolean;
  /** @format date-time */
  deadline?: string;
  allowDonationAboveThreshold: boolean;
  termsAndCondition: string;
  proposerAddress: string;
  treasurers: string[];
  tags: string[];
  images: string[];
  title: string;
  platformFeePercentage?: number;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO3 {
  data: PortalProposals[];
  hasNextPage: boolean;
}

export interface RejectProposalDto {
  comment: string;
}

export interface UpdatePortalPropsalDto {
  platformFeePercentage: number;
  description?: string;
  fundingGoal?: string;
  isMultiSignatureReciever?: boolean;
  sendImmediately?: boolean;
  /** @format date-time */
  deadline?: string;
  allowDonationAboveThreshold?: boolean;
  termsAndCondition?: string;
  proposerAddress?: string;
  treasurers?: string[];
  tags?: string[];
  images?: string[];
  title?: string;
}

export interface UpdatePlatformFeeDto {
  platformFeePercentage: number;
}

export interface TestTrigger {
  date: string;
}

export interface ExtraPortal {
  id: string;
  funds: number;
  externalId: string;
}

export interface ExtraDonationPortalData {
  id: string;
  /** @format date-time */
  donatedAt: string;
  donor: string;
  usdValue: number;
  externalId: string;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickPortalsslug {
  slug: string;
}

export interface CreatePrizeDto {
  address: string;
  proposal_id: string;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO4 {
  data: PrizeWithBlockchainData[];
  hasNextPage: boolean;
}

export interface PrizeWithBlockchainData {
  distributed: boolean;
  submission_time_blockchain: number;
  voting_time_blockchain: number;
  dispute_period_time_blockchain: number;
  refunded: boolean;
  voting_period_active_blockchain: boolean;
  is_active_blockchain: boolean;
  submission_perio_active_blockchain: boolean;
  contributors: string[];
  balance: number;
  id: string;
  description: string;
  isAutomatic: boolean;
  submissionTime: number;
  votingTime: number;
  /** @format date-time */
  startVotingDate: string;
  /** @format date-time */
  startSubmissionDate: string;
  proposer_address: string;
  contract_address: string;
  admins: string[];
  judges?: string[];
  proficiencies: string[];
  priorities: string[];
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  images: string[];
  title: string;
  stage: PrizeStages;
  contestants: User[];
  submissions: Submission[];
  comments?: PrizesComments[];
  slug: string;
  user: User;
}

export interface IndividualPrizeWithBalance {
  contributors: Contributions;
  slug: string;
  description: string;
  images: string[];
  title: string;
  distributed: boolean;
  submission_time_blockchain: number;
  voting_time_blockchain: number;
  dispute_period_time_blockchain: number;
  refunded: boolean;
  voting_period_active_blockchain: boolean;
  is_active_blockchain: boolean;
  submission_perio_active_blockchain: boolean;
  balance: number;
  id: string;
  isAutomatic: boolean;
  submissionTime: number;
  votingTime: number;
  /** @format date-time */
  startVotingDate: string;
  /** @format date-time */
  startSubmissionDate: string;
  proposer_address: string;
  contract_address: string;
  admins: string[];
  judges?: string[];
  proficiencies: string[];
  priorities: string[];
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  stage: PrizeStages;
  contestants: User[];
  submissions: Submission[];
  comments?: PrizesComments[];
  user: User;
}

export interface UpdatePrizeDto {
  platformFeePercentage?: number;
  proposerFeePercentage?: number;
  voting_time?: number;
  submission_time?: number;
  admins?: string[];
  title?: string;
  description?: string;
  proposer_address?: string;
  isAutomatic?: boolean;
  /** @format date-time */
  startVotingDate?: string;
  /** @format date-time */
  startSubmissionDate?: string;
  proficiencies?: (
    | 'Programming'
    | 'Python'
    | 'JavaScript'
    | 'Writing'
    | 'Design'
    | 'Translation'
    | 'Research'
    | 'Real estate'
    | 'Apps'
    | 'Hardware'
    | 'Art'
    | 'Meta'
    | 'AI'
  )[];
  priorities?: (
    | 'Climate change'
    | 'Network civilizations'
    | 'Open-source'
    | 'Community coordination'
    | 'Health'
    | 'Education'
  )[];
  images?: string[];
  judges?: string[];
}

export interface CreateSubmissionDto {
  submissionDescription: string;
  submissionHash: string;
  submitterAddress: string;
}

export interface FetchSubmissionDto {
  submissionDeadline: number;
  id: string;
  submissionDescription: string;
  submissionHash: string;
  submitterAddress: string;
  /** @format date-time */
  created_at: string;
  user: User;
  prize: Prize;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO5 {
  data: SubmissionWithBlockchainData[];
  hasNextPage: boolean;
}

export interface SubmissionWithBlockchainData {
  voting_blockchain: number;
  id: string;
  submissionDescription: string;
  submissionHash: string;
  submitterAddress: string;
  /** @format date-time */
  created_at: string;
  user: User;
  prize: Prize;
}

export interface CreateCommentDtoO1 {
  comment: string;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO6 {
  data: PrizeProposals[];
  hasNextPage: boolean;
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO7 {
  data: PrizeProposals[];
  hasNextPage: boolean;
}

export interface CreatePrizeProposalDto {
  voting_time: number;
  submission_time: number;
  admins: string[];
  title: string;
  description: string;
  proposer_address: string;
  isAutomatic: boolean;
  /** @format date-time */
  startVotingDate?: string;
  /** @format date-time */
  startSubmissionDate?: string;
  proficiencies: (
    | 'Programming'
    | 'Python'
    | 'JavaScript'
    | 'Writing'
    | 'Design'
    | 'Translation'
    | 'Research'
    | 'Real estate'
    | 'Apps'
    | 'Hardware'
    | 'Art'
    | 'Meta'
    | 'AI'
  )[];
  priorities: (
    | 'Climate change'
    | 'Network civilizations'
    | 'Open-source'
    | 'Community coordination'
    | 'Health'
    | 'Education'
  )[];
  images: string[];
  judges?: string[];
}

/** Make all properties in T readonly */
export interface ReadonlyTypeO8 {
  data: PrizeProposals[];
  hasNextPage: boolean;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickPrizeslug {
  slug: string;
}

export interface UpdateExtraPrizeDto {
  fundsUsd?: string;
  fundsInBtc?: string;
  fundsInEth?: string;
  fundsInSol?: string;
  externalId: string;
}

export interface TotalFunds {
  totalFundsInUsd: number;
}

export interface ExtraDonationPrizeData {
  id: string;
  /** @format date-time */
  donationTime: string;
  donor: string;
  value: number;
  valueIn: string;
  externalId: string;
}

export interface CreateExtraDonationPrizeDataDto {
  donor: string;
  value: number;
  valueIn: string;
  externalId: string;
}

/** Interface of Create User , using this interface it create a new user in */
export interface CreateUser {
  /**
   * User's emails which will be used to send emails and futher communication
   * @format email
   */
  email: string;
  /**
   * User Id which is gotten from the auth provider like privy , torus etc...
   * @minLength 5
   */
  authId: string;
  /** The user name which is gotten from the onboarding process or page */
  name: string;
  /** The username which is gotten from the onboarding process or page and it is unique */
  username: string;
  /** The user bio which is gotten from the onboarding process or page */
  bio: string;
  avatar?: string;
  proficiencies?: string[];
  priorities?: string[];
  walletAddress?: string;
}

export interface UpdateUser {
  /**
   * User's emails which will be used to send emails and futher communication
   * @format email
   */
  email?: string;
  /**
   * User Id which is gotten from the auth provider like privy , torus etc...
   * @minLength 5
   */
  authId?: string;
  /** The user name which is gotten from the onboarding process or page */
  name?: string;
  /** The username which is gotten from the onboarding process or page and it is unique */
  username?: string;
  /** The user bio which is gotten from the onboarding process or page */
  bio?: string;
  avatar?: string;
  proficiencies?: string[];
  priorities?: string[];
  walletAddress?: string;
}

/**
 * The Users controller is responsible for handling requests from the client related to user data.
 * This includes creating a new user, getting a user by ID, and getting a user by username.
 */
export interface EmailExistsResponse {
  exists: boolean;
  walletAddress?: string;
}

export interface WalletResponse {
  hash: string;
}

export interface ChangeSubmissionDto {
  minutes: number;
}

export interface ChangeVotingDto {
  minutes: number;
}

export interface VoteDTO {
  submissionHash: string;
  v: number;
  s: string;
  r: string;
  amount: number;
}

export interface AddUsdcFundsDto {
  amount: number;
  deadline: number;
  v: number;
  s: string;
  r: string;
  hash: string;
}

export interface AllocateUsdcFunds {
  amount: number;
  deadline: number;
  v: number;
  s: string;
  r: string;
  hash: string;
  voter: string;
  isFiat: boolean;
}

export interface SendUsdcTransactionDto {
  amount: number;
  receiver: string;
  deadline: number;
  v: number;
  r: string;
  s: string;
  ethSignedMessageHash: string;
}

export namespace Indexer {
  /**
   * No description
   * @name PortalCreate
   * @request POST:/indexer/portal
   */
  export namespace PortalCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }
}

export namespace Portals {
  /**
   * No description
   * @name ClearCacheList
   * @request GET:/portals/clear_cache
   */
  export namespace ClearCacheList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name PortalsCreate
   * @request POST:/portals
   */
  export namespace PortalsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePortalDto;
    export type RequestHeaders = {};
    export type ResponseBody = Portals;
  }

  /**
   * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/portals` endpoint. Here's a breakdown of what it does: Gets page
   * @name PortalsList
   * @summary Get all Portals
   * @request GET:/portals
   */
  export namespace PortalsList {
    export type RequestParams = {};
    export type RequestQuery = {
      page: number;
      limit: number;
      tags?: string[];
      search?: string;
      sort?: 'DESC' | 'ASC';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyType;
  }

  /**
   * @description The function `getPortal` is an asynchronous function that takes a `slug` parameter and gets the associated portal
   * @name PortalsDetail
   * @request GET:/portals/{slug}
   */
  export namespace PortalsDetail {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PortalWithBalance;
  }

  /**
 * @description The function `createComment` is an asynchronous function that takes a `comment` parameter calls the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId` . and it updatees the prize
 * @name CommentCreate
 * @summary The function `createComment` is an asynchronous function that takes a `comment` parameter calls
the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId`
 * @request POST:/portals/{id}/comment
 * @secure
*/
  export namespace CommentCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateCommentDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name CommentRepliesDetail
   * @request GET:/portals/comment/{commentId}/replies
   */
  export namespace CommentRepliesDetail {
    export type RequestParams = {
      commentId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PortalsComments[];
  }

  /**
   * No description
   * @name CommentReplyCreate
   * @request POST:/portals/{id}/comment/reply
   */
  export namespace CommentReplyCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateCommentDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name CommentLikeCreate
   * @request POST:/portals/{id}/comment/like
   */
  export namespace CommentLikeCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name CommentDislikeCreate
   * @request POST:/portals/{id}/comment/dislike
   */
  export namespace CommentDislikeCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name CommentDeleteDelete
   * @request DELETE:/portals/{commentId}/comment/delete
   */
  export namespace CommentDeleteDelete {
    export type RequestParams = {
      commentId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `getComments` is an asynchronous function that takes a `comment` parameter calls the `getComment` method of the `portalCommentService` with the given `id`.
 * @name CommentDetail
 * @summary The function `getComments` is an asynchronous function that takes a `comment` parameter calls
the `getComment` method of the `portalCommentService` with the given `id`
 * @request GET:/portals/{slug}/comment
*/
  export namespace CommentDetail {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PortalsComments[];
  }

  /**
   * No description
   * @name AddUpdateUpdate
   * @request PUT:/portals/{slug}/add-update
   */
  export namespace AddUpdateUpdate {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = string;
    export type RequestHeaders = {};
    export type ResponseBody = Portals;
  }

  /**
   * No description
   * @name ProposalDeleteDelete
   * @request DELETE:/portals/proposal/delete/{id}
   */
  export namespace ProposalDeleteDelete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = boolean;
  }

  /**
   * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/user/{username}` endpoint. Here's a breakdown of what it does: Gets page
   * @name UserDetail
   * @summary Get all Portal of a single user
   * @request GET:/portals/user/{username}
   * @secure
   */
  export namespace UserDetail {
    export type RequestParams = {
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PortalWithBalance[];
  }

  /**
   * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/proposals` endpoint. Here's a breakdown of what it does: Gets page
   * @name ProposalsList
   * @summary Get all Pending proposals
   * @request GET:/portals/proposals
   * @secure
   */
  export namespace ProposalsList {
    export type RequestParams = {};
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO1;
  }

  /**
   * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the POST request to `/proposals` endpoint. Here's a breakdown of what it does:
   * @name ProposalsCreate
   * @summary Create a new proposal using user auth token to know which user is calling this function and sends email to user
   * @request POST:/portals/proposals
   * @secure
   */
  export namespace ProposalsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePortalProposalDto;
    export type RequestHeaders = {};
    export type ResponseBody = PortalProposals;
  }

  /**
   * No description
   * @name ProposalsDetail
   * @request GET:/portals/proposals/{id}
   */
  export namespace ProposalsDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PortalProposals;
  }

  /**
   * @description it updates the proposal
   * @name ProposalsPartialUpdate
   * @request PATCH:/portals/proposals/{id}
   * @secure
   */
  export namespace ProposalsPartialUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdatePortalPropsalDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/proposals/accept` endpoint. Here's a breakdown of what it does: Gets page
 * @name ProposalsAcceptList
 * @summary Retrieve a list of accepted Portal proposals
description: Retrieve a list of accepted Portal proposals. The list supports pagination.
parameters
 * @request GET:/portals/proposals/accept
 * @secure
*/
  export namespace ProposalsAcceptList {
    export type RequestParams = {};
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO2;
  }

  /**
   * @description Get all proposals  of user  by username
   * @name ProposalsUserDetail
   * @summary Get all proposals of users by username,
   * @request GET:/portals/proposals/user/{username}
   */
  export namespace ProposalsUserDetail {
    export type RequestParams = {
      username: string;
    };
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO3;
  }

  /**
   * @description Admin Reject proposal
   * @name ProposalsRejectCreate
   * @summary Reject Proposal,
   * @request POST:/portals/proposals/reject/{id}
   * @secure
   */
  export namespace ProposalsRejectCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RejectProposalDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls the `approve` method of the `portalProposalsService` with the given `id`. and it approves the proposal and sends an email of approval
 * @name ProposalsAcceptCreate
 * @summary The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls
the `approve` method of the `portalProposalsService` with the given `id`
 * @request POST:/portals/proposals/accept/{id}
 * @secure
*/
  export namespace ProposalsAcceptCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
 * @name ProposalsPlatformFeeCreate
 * @summary The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
the ``setPlatformFee method of the `portalProposalsService` with the given `id`
 * @request POST:/portals/proposals/platformFee/{id}
 * @secure
*/
  export namespace ProposalsPlatformFeeCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdatePlatformFeeDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
 * @name TriggerCreate
 * @summary The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
the ``setPlatformFee method of the `portalProposalsService` with the given `id`
 * @request POST:/portals/trigger/{contractAddress}
*/
  export namespace TriggerCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = TestTrigger;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * @description The function `getExtraPortalData` is an asynchronous function that takes an `external id` parameter returns offchain data
   * @name ExtraDataDetail
   * @request GET:/portals/extra_data/{externalId}
   */
  export namespace ExtraDataDetail {
    export type RequestParams = {
      externalId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ExtraPortal;
  }

  /**
   * @description The function `getExtraDonationPortalData` is an asynchronous function that takes an `external id` parameter returns offchain data
   * @name ExtraDonationDataDetail
   * @request GET:/portals/extra_donation_data/{externalId}
   */
  export namespace ExtraDonationDataDetail {
    export type RequestParams = {
      externalId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ExtraDonationPortalData[];
  }

  /**
   * @description The function `getSlugById` is an asynchronous function that takes an id parameter returns the slug associated with id in portals
   * @name SlugDetail
   * @request GET:/portals/slug/{id}
   */
  export namespace SlugDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PickPortalsslug;
  }
}

export namespace Price {
  /**
   * No description
   * @name UsdToEthList
   * @request GET:/price/usd_to_eth
   */
  export namespace UsdToEthList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name UsdToSolList
   * @request GET:/price/usd_to_sol
   */
  export namespace UsdToSolList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name UsdToBtcList
   * @request GET:/price/usd_to_btc
   */
  export namespace UsdToBtcList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
}

export namespace Prizes {
  /**
   * No description
   * @name PrizesCreate
   * @request POST:/prizes
   */
  export namespace PrizesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePrizeDto;
    export type RequestHeaders = {};
    export type ResponseBody = Prize;
  }

  /**
   * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the GET request to `/prizes` endpoint. Here's a breakdown of what it does: Gets page
   * @name PrizesList
   * @summary Get all Prizes
   * @request GET:/prizes
   */
  export namespace PrizesList {
    export type RequestParams = {};
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO4;
  }

  /**
   * No description
   * @name PrizesDetail
   * @request GET:/prizes/{slug}
   */
  export namespace PrizesDetail {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = IndividualPrizeWithBalance;
  }

  /**
   * @description it updates the proposal
   * @name ProposalsUpdate
   * @request PUT:/prizes/proposals/{id}
   * @secure
   */
  export namespace ProposalsUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdatePrizeDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name ProposalsDetail
   * @request GET:/prizes/proposals/{id}
   */
  export namespace ProposalsDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PrizeProposals;
  }

  /**
   * No description
   * @name ProposalsDeletedDelete
   * @request DELETE:/prizes/proposals/deleted/{id}
   */
  export namespace ProposalsDeletedDelete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name SubmissionCreate
   * @request POST:/prizes/{slug}/submission
   */
  export namespace SubmissionCreate {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateSubmissionDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name SubmissionDetail
   * @request GET:/prizes/{slug}/submission
   */
  export namespace SubmissionDetail {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO5;
  }

  /**
   * No description
   * @name SubmissionDetail2
   * @request GET:/prizes/{slug}/submission/{id}
   * @originalName submissionDetail
   * @duplicate
   */
  export namespace SubmissionDetail2 {
    export type RequestParams = {
      id: string;
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchSubmissionDto;
  }

  /**
   * No description
   * @name SubmissionPartialUpdate
   * @request PATCH:/prizes/submission/{id}
   */
  export namespace SubmissionPartialUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = string;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name ParticipateCreate
   * @request POST:/prizes/{slug}/participate
   */
  export namespace ParticipateCreate {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name ContestantsDetail
   * @request GET:/prizes/{slug}/contestants
   */
  export namespace ContestantsDetail {
    export type RequestParams = {
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User[];
  }

  /**
 * @description The function `createComment` is an asynchronous function that takes a `comment` parameter calls the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId` . and it updatees the prize
 * @name CommentCreate
 * @summary The function `createComment` is an asynchronous function that takes a `comment` parameter calls
the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId`
 * @request POST:/prizes/{id}/comment
 * @secure
*/
  export namespace CommentCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateCommentDtoO1;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `getComments` is an asynchronous function that takes a `comment` parameter calls the `getComment` method of the `prizeCommentService` with the given `id`.
 * @name CommentDetail
 * @summary The function `getComments` is an asynchronous function that takes a `comment` parameter calls
the `getComment` method of the `prizeCommentService` with the given `id`
 * @request GET:/prizes/{id}/comment
*/
  export namespace CommentDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PrizesComments[];
  }

  /**
   * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the GET request to `/proposals` endpoint. Here's a breakdown of what it does: Gets page
   * @name ProposalsList
   * @summary Get all Pending proposals
   * @request GET:/prizes/proposals
   * @secure
   */
  export namespace ProposalsList {
    export type RequestParams = {};
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO6;
  }

  /**
   * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the POST request to `/proposals` endpoint. Here's a breakdown of what it does:
   * @name ProposalsCreate
   * @summary Create a new proposal using user auth token to know which user is calling this function and sends email to user
   * @request POST:/prizes/proposals
   * @secure
   */
  export namespace ProposalsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePrizeProposalDto;
    export type RequestHeaders = {};
    export type ResponseBody = PrizeProposals;
  }

  /**
 * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the GET request to `/proposals/accept` endpoint. Here's a breakdown of what it does: Gets page
 * @name ProposalsAcceptList
 * @summary Retrieve a list of accepted prize proposals
description: Retrieve a list of accepted prize proposals. The list supports pagination.
parameters
 * @request GET:/prizes/proposals/accept
 * @secure
*/
  export namespace ProposalsAcceptList {
    export type RequestParams = {};
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO7;
  }

  /**
   * @description Get all proposals  of user  by username
   * @name ProposalsUserDetail
   * @summary Get all proposals of users by username,
   * @request GET:/prizes/proposals/user/{username}
   */
  export namespace ProposalsUserDetail {
    export type RequestParams = {
      username: string;
    };
    export type RequestQuery = {
      page: number;
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadonlyTypeO8;
  }

  /**
   * @description Admin Reject proposal
   * @name ProposalsRejectCreate
   * @summary Reject Proposal,
   * @request POST:/prizes/proposals/reject/{id}
   * @secure
   */
  export namespace ProposalsRejectCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RejectProposalDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls the `approve` method of the `prizeProposalsService` with the given `id`. and it approves the proposal and sends an email of approval
 * @name ProposalsAcceptCreate
 * @summary The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls
the `approve` method of the `prizeProposalsService` with the given `id`
 * @request POST:/prizes/proposals/accept/{id}
 * @secure
*/
  export namespace ProposalsAcceptCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
 * @description The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
 * @name ProposalsPlatformFeeCreate
 * @summary The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
the ``setPlatformFee method of the `portalProposalsService` with the given `id`
 * @request POST:/prizes/proposals/platformFee/{id}
 * @secure
*/
  export namespace ProposalsPlatformFeeCreate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdatePlatformFeeDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * @description The function `getSlugById` is an asynchronous function that takes an id parameter returns the slug associated with id in portals
   * @name SlugDetail
   * @request GET:/prizes/slug/{id}
   */
  export namespace SlugDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PickPrizeslug;
  }

  /**
   * @description Create extra data for a prize
   * @name ExtraDataCreate
   * @request POST:/prizes/extra_data/{prize_id}
   */
  export namespace ExtraDataCreate {
    export type RequestParams = {
      /** - The ID of the prize */
      prizeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateExtraPrizeDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * @description Get extra data for a prize
   * @name ExtraDataDetail
   * @request GET:/prizes/extra_data/{prize_id}
   */
  export namespace ExtraDataDetail {
    export type RequestParams = {
      /** - The ID of the prize */
      prizeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TotalFunds;
  }

  /**
   * @description Fetch extra donation data for a prize
   * @name ExtraDataDonationsDetail
   * @request GET:/prizes/extra_data/donations/{prize_id}
   */
  export namespace ExtraDataDonationsDetail {
    export type RequestParams = {
      /** - The ID of the prize */
      prizeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ExtraDonationPrizeData[];
  }

  /**
   * @description Create extra donation data for a prize
   * @name ExtraDataDonationsCreate
   * @request POST:/prizes/extra_data/donations/{prize_id}
   */
  export namespace ExtraDataDonationsCreate {
    export type RequestParams = {
      /** - The ID of the prize */
      prizeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateExtraDonationPrizeDataDto;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * No description
   * @name AddressDetail
   * @request GET:/prizes/address/{id}
   */
  export namespace AddressDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }
}

export namespace Users {
  /**
   * @description Creates a new user and sends welcome email.
   * @name UsersCreate
   * @summary Creates a new user and sends welcome email
   * @request POST:/users
   */
  export namespace UsersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateUser;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }

  /**
   * No description
   * @name UpdateCreate
   * @request POST:/users/update/{username}
   */
  export namespace UpdateCreate {
    export type RequestParams = {
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateUser;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }

  /**
   * No description
   * @name ClearCacheList
   * @request GET:/users/clear_cache
   */
  export namespace ClearCacheList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Http200Response;
  }

  /**
   * @description Get a user by ID.
   * @name UsersDetail
   * @summary Get a user by ID
   * @request GET:/users/{authId}
   */
  export namespace UsersDetail {
    export type RequestParams = {
      authId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }

  /**
   * @description Get a user by username.
   * @name UsernameDetail
   * @summary Get a user by username
   * @request GET:/users/username/{username}
   */
  export namespace UsernameDetail {
    export type RequestParams = {
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }

  /**
   * @description Endpoint for checking if a user with the specified username exists.
   * @name ExistsDetail
   * @summary Endpoint for checking if a user with the specified username exists
   * @request GET:/users/exists/{username}
   */
  export namespace ExistsDetail {
    export type RequestParams = {
      /** The username to check. */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = boolean;
  }

  /**
   * @description Endpoint for checking if a user with the specified email exists.
   * @name ExistsEmailDetail
   * @summary Endpoint for checking if a user with the specified email exists
   * @request GET:/users/exists/email/{email}
   */
  export namespace ExistsEmailDetail {
    export type RequestParams = {
      /** The email to check. */
      email: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EmailExistsResponse;
  }

  /**
   * @description Endpoint for getting submission of a specified username.
   * @name UsernameSubmissionsDetail
   * @summary Endpoint for getting submission of a specified username
   * @request GET:/users/username/{username}/submissions
   */
  export namespace UsernameSubmissionsDetail {
    export type RequestParams = {
      /** The username to check. */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Submission[];
  }

  /**
   * @description Endpoint for getting prizes of a specified username.
   * @name UsernamePrizesDetail
   * @summary Endpoint for getting prizes of a specified username
   * @request GET:/users/username/{username}/prizes
   */
  export namespace UsernamePrizesDetail {
    export type RequestParams = {
      /** The username to check. */
      username: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PrizeWithBlockchainData[];
  }
}

export namespace Wallet {
  /**
   * No description
   * @name PrizeStartSubmissionCreate
   * @request POST:/wallet/prize/{contract_address}/start_submission
   * @secure
   */
  export namespace PrizeStartSubmissionCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeEndSubmissionCreate
   * @request POST:/wallet/prize/{contract_address}/end_submission
   * @secure
   */
  export namespace PrizeEndSubmissionCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeStartVotingCreate
   * @request POST:/wallet/prize/{contract_address}/start_voting
   * @secure
   */
  export namespace PrizeStartVotingCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeEndVotingCreate
   * @request POST:/wallet/prize/{contract_address}/end_voting
   * @secure
   */
  export namespace PrizeEndVotingCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeChangeSubmissionCreate
   * @request POST:/wallet/prize/{contract_address}/change_submission
   * @secure
   */
  export namespace PrizeChangeSubmissionCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ChangeSubmissionDto;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeChangeVotingCreate
   * @request POST:/wallet/prize/{contract_address}/change_voting
   * @secure
   */
  export namespace PrizeChangeVotingCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ChangeVotingDto;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeEndDisputeCreate
   * @request POST:/wallet/prize/{contract_address}/end_dispute
   * @secure
   */
  export namespace PrizeEndDisputeCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeEndDisputeEarlyCreate
   * @request POST:/wallet/prize/{contract_address}/end_dispute_early
   * @secure
   */
  export namespace PrizeEndDisputeEarlyCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeVoteCreate
   * @request POST:/wallet/prize/{contract_address}/vote
   * @secure
   */
  export namespace PrizeVoteCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = VoteDTO;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeAddUsdcFundsCreate
   * @request POST:/wallet/prize/{contract_address}/add_usdc_funds
   * @secure
   */
  export namespace PrizeAddUsdcFundsCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AddUsdcFundsDto;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PrizeAllocateUsdcFundsCreate
   * @request POST:/wallet/prize/{contract_address}/allocate_usdc_funds
   * @secure
   */
  export namespace PrizeAllocateUsdcFundsCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AllocateUsdcFunds;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name PortalAddUsdcFundsCreate
   * @request POST:/wallet/portal/{contract_address}/add_usdc_funds
   */
  export namespace PortalAddUsdcFundsCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AddUsdcFundsDto;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name FundRaisersEndCampaignCreate
   * @request POST:/wallet/fund_raisers/{contract_address}/end_campaign
   * @secure
   */
  export namespace FundRaisersEndCampaignCreate {
    export type RequestParams = {
      contractAddress: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }

  /**
   * No description
   * @name SendUsdcTransactionCreate
   * @request POST:/wallet/send_usdc_transaction
   */
  export namespace SendUsdcTransactionCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendUsdcTransactionDto;
    export type RequestHeaders = {};
    export type ResponseBody = WalletResponse;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = env.NEXT_PUBLIC_BACKEND_URL;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal:
          (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) ||
          null,
        body:
          typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title nestjs-boilerplate
 * @version 0.0.1
 * @license UNLICENSED
 * @baseUrl http://localhost:3001/api
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  indexer = {
    /**
     * No description
     *
     * @name PortalCreate
     * @request POST:/indexer/portal
     */
    portalCreate: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/indexer/portal`,
        method: 'POST',
        format: 'json',
        ...params,
      }),
  };
  portals = {
    /**
     * No description
     *
     * @name ClearCacheList
     * @request GET:/portals/clear_cache
     */
    clearCacheList: (params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/portals/clear_cache`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PortalsCreate
     * @request POST:/portals
     */
    portalsCreate: (data: CreatePortalDto, params: RequestParams = {}) =>
      this.request<Portals, any>({
        path: `/portals`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/portals` endpoint. Here's a breakdown of what it does: Gets page
     *
     * @name PortalsList
     * @summary Get all Portals
     * @request GET:/portals
     */
    portalsList: (
      query: {
        page: number;
        limit: number;
        tags?: string[];
        search?: string;
        sort?: 'DESC' | 'ASC';
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyType, any>({
        path: `/portals`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description The function `getPortal` is an asynchronous function that takes a `slug` parameter and gets the associated portal
     *
     * @name PortalsDetail
     * @request GET:/portals/{slug}
     */
    portalsDetail: (slug: string, params: RequestParams = {}) =>
      this.request<PortalWithBalance, any>({
        path: `/portals/${slug}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `createComment` is an asynchronous function that takes a `comment` parameter calls the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId` . and it updatees the prize
 *
 * @name CommentCreate
 * @summary The function `createComment` is an asynchronous function that takes a `comment` parameter calls
the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId`
 * @request POST:/portals/{id}/comment
 * @secure
 */
    commentCreate: (id: string, data: CreateCommentDto, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/portals/${id}/comment`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CommentRepliesDetail
     * @request GET:/portals/comment/{commentId}/replies
     */
    commentRepliesDetail: (commentId: string, params: RequestParams = {}) =>
      this.request<PortalsComments[], any>({
        path: `/portals/comment/${commentId}/replies`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CommentReplyCreate
     * @request POST:/portals/{id}/comment/reply
     */
    commentReplyCreate: (
      id: string,
      data: CreateCommentDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/portals/${id}/comment/reply`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CommentLikeCreate
     * @request POST:/portals/{id}/comment/like
     */
    commentLikeCreate: (id: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/portals/${id}/comment/like`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CommentDislikeCreate
     * @request POST:/portals/{id}/comment/dislike
     */
    commentDislikeCreate: (id: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/portals/${id}/comment/dislike`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name CommentDeleteDelete
     * @request DELETE:/portals/{commentId}/comment/delete
     */
    commentDeleteDelete: (commentId: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/portals/${commentId}/comment/delete`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `getComments` is an asynchronous function that takes a `comment` parameter calls the `getComment` method of the `portalCommentService` with the given `id`.
 *
 * @name CommentDetail
 * @summary The function `getComments` is an asynchronous function that takes a `comment` parameter calls
the `getComment` method of the `portalCommentService` with the given `id`
 * @request GET:/portals/{slug}/comment
 */
    commentDetail: (slug: string, params: RequestParams = {}) =>
      this.request<PortalsComments[], any>({
        path: `/portals/${slug}/comment`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AddUpdateUpdate
     * @request PUT:/portals/{slug}/add-update
     */
    addUpdateUpdate: (slug: string, data: string, params: RequestParams = {}) =>
      this.request<Portals, any>({
        path: `/portals/${slug}/add-update`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProposalDeleteDelete
     * @request DELETE:/portals/proposal/delete/{id}
     */
    proposalDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/portals/proposal/delete/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/user/{username}` endpoint. Here's a breakdown of what it does: Gets page
     *
     * @name UserDetail
     * @summary Get all Portal of a single user
     * @request GET:/portals/user/{username}
     * @secure
     */
    userDetail: (username: string, params: RequestParams = {}) =>
      this.request<PortalWithBalance[], any>({
        path: `/portals/user/${username}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/proposals` endpoint. Here's a breakdown of what it does: Gets page
     *
     * @name ProposalsList
     * @summary Get all Pending proposals
     * @request GET:/portals/proposals
     * @secure
     */
    proposalsList: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO1, any>({
        path: `/portals/proposals`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the POST request to `/proposals` endpoint. Here's a breakdown of what it does:
     *
     * @name ProposalsCreate
     * @summary Create a new proposal using user auth token to know which user is calling this function and sends email to user
     * @request POST:/portals/proposals
     * @secure
     */
    proposalsCreate: (data: CreatePortalProposalDto, params: RequestParams = {}) =>
      this.request<PortalProposals, any>({
        path: `/portals/proposals`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProposalsDetail
     * @request GET:/portals/proposals/{id}
     */
    proposalsDetail: (id: string, params: RequestParams = {}) =>
      this.request<PortalProposals, any>({
        path: `/portals/proposals/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description it updates the proposal
     *
     * @name ProposalsPartialUpdate
     * @request PATCH:/portals/proposals/{id}
     * @secure
     */
    proposalsPartialUpdate: (
      id: string,
      data: UpdatePortalPropsalDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/portals/proposals/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description The code snippet you provided is a method in the `PortalsController` class. It is a route handler for the GET request to `/proposals/accept` endpoint. Here's a breakdown of what it does: Gets page
 *
 * @name ProposalsAcceptList
 * @summary Retrieve a list of accepted Portal proposals
description: Retrieve a list of accepted Portal proposals. The list supports pagination.
parameters
 * @request GET:/portals/proposals/accept
 * @secure
 */
    proposalsAcceptList: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO2, any>({
        path: `/portals/proposals/accept`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all proposals  of user  by username
     *
     * @name ProposalsUserDetail
     * @summary Get all proposals of users by username,
     * @request GET:/portals/proposals/user/{username}
     */
    proposalsUserDetail: (
      username: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO3, any>({
        path: `/portals/proposals/user/${username}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Admin Reject proposal
     *
     * @name ProposalsRejectCreate
     * @summary Reject Proposal,
     * @request POST:/portals/proposals/reject/{id}
     * @secure
     */
    proposalsRejectCreate: (
      id: string,
      data: RejectProposalDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/portals/proposals/reject/${id}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls the `approve` method of the `portalProposalsService` with the given `id`. and it approves the proposal and sends an email of approval
 *
 * @name ProposalsAcceptCreate
 * @summary The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls
the `approve` method of the `portalProposalsService` with the given `id`
 * @request POST:/portals/proposals/accept/{id}
 * @secure
 */
    proposalsAcceptCreate: (id: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/portals/proposals/accept/${id}`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
 *
 * @name ProposalsPlatformFeeCreate
 * @summary The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
the ``setPlatformFee method of the `portalProposalsService` with the given `id`
 * @request POST:/portals/proposals/platformFee/{id}
 * @secure
 */
    proposalsPlatformFeeCreate: (
      id: string,
      data: UpdatePlatformFeeDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/portals/proposals/platformFee/${id}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
 *
 * @name TriggerCreate
 * @summary The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
the ``setPlatformFee method of the `portalProposalsService` with the given `id`
 * @request POST:/portals/trigger/{contractAddress}
 */
    triggerCreate: (
      contractAddress: string,
      data: TestTrigger,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/portals/trigger/${contractAddress}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The function `getExtraPortalData` is an asynchronous function that takes an `external id` parameter returns offchain data
     *
     * @name ExtraDataDetail
     * @request GET:/portals/extra_data/{externalId}
     */
    extraDataDetail: (externalId: string, params: RequestParams = {}) =>
      this.request<ExtraPortal, any>({
        path: `/portals/extra_data/${externalId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description The function `getExtraDonationPortalData` is an asynchronous function that takes an `external id` parameter returns offchain data
     *
     * @name ExtraDonationDataDetail
     * @request GET:/portals/extra_donation_data/{externalId}
     */
    extraDonationDataDetail: (externalId: string, params: RequestParams = {}) =>
      this.request<ExtraDonationPortalData[], any>({
        path: `/portals/extra_donation_data/${externalId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description The function `getSlugById` is an asynchronous function that takes an id parameter returns the slug associated with id in portals
     *
     * @name SlugDetail
     * @request GET:/portals/slug/{id}
     */
    slugDetail: (id: string, params: RequestParams = {}) =>
      this.request<PickPortalsslug, any>({
        path: `/portals/slug/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  price = {
    /**
     * No description
     *
     * @name UsdToEthList
     * @request GET:/price/usd_to_eth
     */
    usdToEthList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/price/usd_to_eth`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsdToSolList
     * @request GET:/price/usd_to_sol
     */
    usdToSolList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/price/usd_to_sol`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UsdToBtcList
     * @request GET:/price/usd_to_btc
     */
    usdToBtcList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/price/usd_to_btc`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  prizes = {
    /**
     * No description
     *
     * @name PrizesCreate
     * @request POST:/prizes
     */
    prizesCreate: (data: CreatePrizeDto, params: RequestParams = {}) =>
      this.request<Prize, any>({
        path: `/prizes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the GET request to `/prizes` endpoint. Here's a breakdown of what it does: Gets page
     *
     * @name PrizesList
     * @summary Get all Prizes
     * @request GET:/prizes
     */
    prizesList: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO4, any>({
        path: `/prizes`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizesDetail
     * @request GET:/prizes/{slug}
     */
    prizesDetail: (slug: string, params: RequestParams = {}) =>
      this.request<IndividualPrizeWithBalance, any>({
        path: `/prizes/${slug}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description it updates the proposal
     *
     * @name ProposalsUpdate
     * @request PUT:/prizes/proposals/{id}
     * @secure
     */
    proposalsUpdate: (id: string, data: UpdatePrizeDto, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/proposals/${id}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProposalsDetail
     * @request GET:/prizes/proposals/{id}
     */
    proposalsDetail: (id: string, params: RequestParams = {}) =>
      this.request<PrizeProposals, any>({
        path: `/prizes/proposals/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProposalsDeletedDelete
     * @request DELETE:/prizes/proposals/deleted/{id}
     */
    proposalsDeletedDelete: (id: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/proposals/deleted/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name SubmissionCreate
     * @request POST:/prizes/{slug}/submission
     */
    submissionCreate: (
      slug: string,
      data: CreateSubmissionDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/prizes/${slug}/submission`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name SubmissionDetail
     * @request GET:/prizes/{slug}/submission
     */
    submissionDetail: (
      slug: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO5, any>({
        path: `/prizes/${slug}/submission`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name SubmissionDetail2
     * @request GET:/prizes/{slug}/submission/{id}
     * @originalName submissionDetail
     * @duplicate
     */
    submissionDetail2: (id: string, slug: string, params: RequestParams = {}) =>
      this.request<FetchSubmissionDto, any>({
        path: `/prizes/${slug}/submission/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name SubmissionPartialUpdate
     * @request PATCH:/prizes/submission/{id}
     */
    submissionPartialUpdate: (id: string, data: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/submission/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ParticipateCreate
     * @request POST:/prizes/{slug}/participate
     */
    participateCreate: (slug: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/${slug}/participate`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ContestantsDetail
     * @request GET:/prizes/{slug}/contestants
     */
    contestantsDetail: (slug: string, params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/prizes/${slug}/contestants`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `createComment` is an asynchronous function that takes a `comment` parameter calls the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId` . and it updatees the prize
 *
 * @name CommentCreate
 * @summary The function `createComment` is an asynchronous function that takes a `comment` parameter calls
the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId`
 * @request POST:/prizes/{id}/comment
 * @secure
 */
    commentCreate: (id: string, data: CreateCommentDtoO1, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/${id}/comment`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `getComments` is an asynchronous function that takes a `comment` parameter calls the `getComment` method of the `prizeCommentService` with the given `id`.
 *
 * @name CommentDetail
 * @summary The function `getComments` is an asynchronous function that takes a `comment` parameter calls
the `getComment` method of the `prizeCommentService` with the given `id`
 * @request GET:/prizes/{id}/comment
 */
    commentDetail: (id: string, params: RequestParams = {}) =>
      this.request<PrizesComments[], any>({
        path: `/prizes/${id}/comment`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the GET request to `/proposals` endpoint. Here's a breakdown of what it does: Gets page
     *
     * @name ProposalsList
     * @summary Get all Pending proposals
     * @request GET:/prizes/proposals
     * @secure
     */
    proposalsList: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO6, any>({
        path: `/prizes/proposals`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the POST request to `/proposals` endpoint. Here's a breakdown of what it does:
     *
     * @name ProposalsCreate
     * @summary Create a new proposal using user auth token to know which user is calling this function and sends email to user
     * @request POST:/prizes/proposals
     * @secure
     */
    proposalsCreate: (data: CreatePrizeProposalDto, params: RequestParams = {}) =>
      this.request<PrizeProposals, any>({
        path: `/prizes/proposals`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description The code snippet you provided is a method in the `PrizesController` class. It is a route handler for the GET request to `/proposals/accept` endpoint. Here's a breakdown of what it does: Gets page
 *
 * @name ProposalsAcceptList
 * @summary Retrieve a list of accepted prize proposals
description: Retrieve a list of accepted prize proposals. The list supports pagination.
parameters
 * @request GET:/prizes/proposals/accept
 * @secure
 */
    proposalsAcceptList: (
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO7, any>({
        path: `/prizes/proposals/accept`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all proposals  of user  by username
     *
     * @name ProposalsUserDetail
     * @summary Get all proposals of users by username,
     * @request GET:/prizes/proposals/user/{username}
     */
    proposalsUserDetail: (
      username: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO8, any>({
        path: `/prizes/proposals/user/${username}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Admin Reject proposal
     *
     * @name ProposalsRejectCreate
     * @summary Reject Proposal,
     * @request POST:/prizes/proposals/reject/{id}
     * @secure
     */
    proposalsRejectCreate: (
      id: string,
      data: RejectProposalDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/prizes/proposals/reject/${id}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls the `approve` method of the `prizeProposalsService` with the given `id`. and it approves the proposal and sends an email of approval
 *
 * @name ProposalsAcceptCreate
 * @summary The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls
the `approve` method of the `prizeProposalsService` with the given `id`
 * @request POST:/prizes/proposals/accept/{id}
 * @secure
 */
    proposalsAcceptCreate: (id: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/proposals/accept/${id}`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
 *
 * @name ProposalsPlatformFeeCreate
 * @summary The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
the ``setPlatformFee method of the `portalProposalsService` with the given `id`
 * @request POST:/prizes/proposals/platformFee/{id}
 * @secure
 */
    proposalsPlatformFeeCreate: (
      id: string,
      data: UpdatePlatformFeeDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/prizes/proposals/platformFee/${id}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The function `getSlugById` is an asynchronous function that takes an id parameter returns the slug associated with id in portals
     *
     * @name SlugDetail
     * @request GET:/prizes/slug/{id}
     */
    slugDetail: (id: string, params: RequestParams = {}) =>
      this.request<PickPrizeslug, any>({
        path: `/prizes/slug/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Create extra data for a prize
     *
     * @name ExtraDataCreate
     * @request POST:/prizes/extra_data/{prize_id}
     */
    extraDataCreate: (
      prizeId: string,
      data: UpdateExtraPrizeDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/prizes/extra_data/${prizeId}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get extra data for a prize
     *
     * @name ExtraDataDetail
     * @request GET:/prizes/extra_data/{prize_id}
     */
    extraDataDetail: (prizeId: string, params: RequestParams = {}) =>
      this.request<TotalFunds, any>({
        path: `/prizes/extra_data/${prizeId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Fetch extra donation data for a prize
     *
     * @name ExtraDataDonationsDetail
     * @request GET:/prizes/extra_data/donations/{prize_id}
     */
    extraDataDonationsDetail: (prizeId: string, params: RequestParams = {}) =>
      this.request<ExtraDonationPrizeData[], any>({
        path: `/prizes/extra_data/donations/${prizeId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Create extra donation data for a prize
     *
     * @name ExtraDataDonationsCreate
     * @request POST:/prizes/extra_data/donations/{prize_id}
     */
    extraDataDonationsCreate: (
      prizeId: string,
      data: CreateExtraDonationPrizeDataDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/prizes/extra_data/donations/${prizeId}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AddressDetail
     * @request GET:/prizes/address/{id}
     */
    addressDetail: (id: string, params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/prizes/address/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  users = {
    /**
     * @description Creates a new user and sends welcome email.
     *
     * @name UsersCreate
     * @summary Creates a new user and sends welcome email
     * @request POST:/users
     */
    usersCreate: (data: CreateUser, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name UpdateCreate
     * @request POST:/users/update/{username}
     */
    updateCreate: (username: string, data: UpdateUser, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/update/${username}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name ClearCacheList
     * @request GET:/users/clear_cache
     */
    clearCacheList: (params: RequestParams = {}) =>
      this.request<Http200Response, any>({
        path: `/users/clear_cache`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Get a user by ID.
     *
     * @name UsersDetail
     * @summary Get a user by ID
     * @request GET:/users/{authId}
     */
    usersDetail: (authId: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${authId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Get a user by username.
     *
     * @name UsernameDetail
     * @summary Get a user by username
     * @request GET:/users/username/{username}
     */
    usernameDetail: (username: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/username/${username}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Endpoint for checking if a user with the specified username exists.
     *
     * @name ExistsDetail
     * @summary Endpoint for checking if a user with the specified username exists
     * @request GET:/users/exists/{username}
     */
    existsDetail: (username: string, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/users/exists/${username}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Endpoint for checking if a user with the specified email exists.
     *
     * @name ExistsEmailDetail
     * @summary Endpoint for checking if a user with the specified email exists
     * @request GET:/users/exists/email/{email}
     */
    existsEmailDetail: (email: string, params: RequestParams = {}) =>
      this.request<EmailExistsResponse, any>({
        path: `/users/exists/email/${email}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Endpoint for getting submission of a specified username.
     *
     * @name UsernameSubmissionsDetail
     * @summary Endpoint for getting submission of a specified username
     * @request GET:/users/username/{username}/submissions
     */
    usernameSubmissionsDetail: (username: string, params: RequestParams = {}) =>
      this.request<Submission[], any>({
        path: `/users/username/${username}/submissions`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Endpoint for getting prizes of a specified username.
     *
     * @name UsernamePrizesDetail
     * @summary Endpoint for getting prizes of a specified username
     * @request GET:/users/username/{username}/prizes
     */
    usernamePrizesDetail: (username: string, params: RequestParams = {}) =>
      this.request<PrizeWithBlockchainData[], any>({
        path: `/users/username/${username}/prizes`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  wallet = {
    /**
     * No description
     *
     * @name PrizeStartSubmissionCreate
     * @request POST:/wallet/prize/{contract_address}/start_submission
     * @secure
     */
    prizeStartSubmissionCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/start_submission`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeEndSubmissionCreate
     * @request POST:/wallet/prize/{contract_address}/end_submission
     * @secure
     */
    prizeEndSubmissionCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/end_submission`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeStartVotingCreate
     * @request POST:/wallet/prize/{contract_address}/start_voting
     * @secure
     */
    prizeStartVotingCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/start_voting`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeEndVotingCreate
     * @request POST:/wallet/prize/{contract_address}/end_voting
     * @secure
     */
    prizeEndVotingCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/end_voting`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeChangeSubmissionCreate
     * @request POST:/wallet/prize/{contract_address}/change_submission
     * @secure
     */
    prizeChangeSubmissionCreate: (
      contractAddress: string,
      data: ChangeSubmissionDto,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/change_submission`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeChangeVotingCreate
     * @request POST:/wallet/prize/{contract_address}/change_voting
     * @secure
     */
    prizeChangeVotingCreate: (
      contractAddress: string,
      data: ChangeVotingDto,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/change_voting`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeEndDisputeCreate
     * @request POST:/wallet/prize/{contract_address}/end_dispute
     * @secure
     */
    prizeEndDisputeCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/end_dispute`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeEndDisputeEarlyCreate
     * @request POST:/wallet/prize/{contract_address}/end_dispute_early
     * @secure
     */
    prizeEndDisputeEarlyCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/end_dispute_early`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeVoteCreate
     * @request POST:/wallet/prize/{contract_address}/vote
     * @secure
     */
    prizeVoteCreate: (
      contractAddress: string,
      data: VoteDTO,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/vote`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeAddUsdcFundsCreate
     * @request POST:/wallet/prize/{contract_address}/add_usdc_funds
     * @secure
     */
    prizeAddUsdcFundsCreate: (
      contractAddress: string,
      data: AddUsdcFundsDto,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/add_usdc_funds`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PrizeAllocateUsdcFundsCreate
     * @request POST:/wallet/prize/{contract_address}/allocate_usdc_funds
     * @secure
     */
    prizeAllocateUsdcFundsCreate: (
      contractAddress: string,
      data: AllocateUsdcFunds,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/prize/${contractAddress}/allocate_usdc_funds`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PortalAddUsdcFundsCreate
     * @request POST:/wallet/portal/{contract_address}/add_usdc_funds
     */
    portalAddUsdcFundsCreate: (
      contractAddress: string,
      data: AddUsdcFundsDto,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/portal/${contractAddress}/add_usdc_funds`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name FundRaisersEndCampaignCreate
     * @request POST:/wallet/fund_raisers/{contract_address}/end_campaign
     * @secure
     */
    fundRaisersEndCampaignCreate: (contractAddress: string, params: RequestParams = {}) =>
      this.request<WalletResponse, any>({
        path: `/wallet/fund_raisers/${contractAddress}/end_campaign`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name SendUsdcTransactionCreate
     * @request POST:/wallet/send_usdc_transaction
     */
    sendUsdcTransactionCreate: (
      data: SendUsdcTransactionDto,
      params: RequestParams = {},
    ) =>
      this.request<WalletResponse, any>({
        path: `/wallet/send_usdc_transaction`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
}

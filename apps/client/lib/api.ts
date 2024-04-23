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

/** Interface of Create Pactt , using this interface it create a new pact in pact.service.ts */
export interface CreatePact {
  /** Name of the pact i.e the title, which is gotten in the pact form */
  name: string;
  /** Terms of the pact i.e the Description */
  terms: string;
  /**
   * Address of the pact on the blockchain
   * @maxLength 44
   */
  address: string;
  /**
   * Transaction hash of the pact on the blockchain
   * @maxLength 66
   */
  transactionHash: string;
  /** Block hash of the pact on the blockchain */
  blockHash?: string;
}

export interface Pact {
  id: number;
  name: string;
  terms: string;
  address: string;
  transactionHash: string;
  blockHash: string;
}

export type PactNullable = {
  id: number;
  name: string;
  terms: string;
  address: string;
  transactionHash: string;
  blockHash: string;
} | null;

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
  submissions: Submission[];
  comments?: PrizesComments[];
  user: User;
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
      const r = response as HttpResponse<T, E>;
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
  pacts = {
    /**
     * No description
     *
     * @name PactsCreate
     * @request POST:/pacts
     */
    pactsCreate: (data: CreatePact, params: RequestParams = {}) =>
      this.request<Pact, any>({
        path: `/pacts`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name PactsDetail
     * @request GET:/pacts/{address}
     */
    pactsDetail: (address: string, params: RequestParams = {}) =>
      this.request<PactNullable, any>({
        path: `/pacts/${address}`,
        method: 'GET',
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
     * No description
     *
     * @name PortalsDetail
     * @request GET:/portals/{id}
     */
    portalsDetail: (id: string, params: RequestParams = {}) =>
      this.request<PortalWithBalance, any>({
        path: `/portals/${id}`,
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
 * @description The function `getComments` is an asynchronous function that takes a `comment` parameter calls the `getComment` method of the `portalCommentService` with the given `id`.
 *
 * @name CommentDetail
 * @summary The function `getComments` is an asynchronous function that takes a `comment` parameter calls
the `getComment` method of the `portalCommentService` with the given `id`
 * @request GET:/portals/{id}/comment
 */
    commentDetail: (id: string, params: RequestParams = {}) =>
      this.request<PortalsComments[], any>({
        path: `/portals/${id}/comment`,
        method: 'GET',
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
     * No description
     *
     * @name AddUpdateUpdate
     * @request PUT:/portals/{id}/add-update
     */
    addUpdateUpdate: (id: string, data: string, params: RequestParams = {}) =>
      this.request<Portals, any>({
        path: `/portals/${id}/add-update`,
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
  };
  prizes = {
    /**
     * No description
     *
     * @name SubmissionDetail
     * @request GET:/prizes/submission/{id}
     */
    submissionDetail: (id: string, params: RequestParams = {}) =>
      this.request<Submission, any>({
        path: `/prizes/submission/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

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
     * @request GET:/prizes/{id}
     */
    prizesDetail: (id: string, params: RequestParams = {}) =>
      this.request<PrizeWithBlockchainData, any>({
        path: `/prizes/${id}`,
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
     * @request POST:/prizes/{id}/submission
     */
    submissionCreate: (
      id: string,
      data: CreateSubmissionDto,
      params: RequestParams = {},
    ) =>
      this.request<Http200Response, any>({
        path: `/prizes/${id}/submission`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name SubmissionDetail2
     * @request GET:/prizes/{id}/submission
     * @originalName submissionDetail
     * @duplicate
     */
    submissionDetail2: (
      id: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadonlyTypeO5, any>({
        path: `/prizes/${id}/submission`,
        method: 'GET',
        query: query,
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
}

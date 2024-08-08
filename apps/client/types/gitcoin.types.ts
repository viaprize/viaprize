import type { Address } from 'viem';

export type RoundPayoutType =
  | 'allov1.Direct'
  | 'allov1.QF'
  | 'allov2.DirectGrantsSimpleStrategy'
  | 'allov2.DirectGrantsLiteStrategy'
  | 'allov2.DonationVotingMerkleDistributionDirectTransferStrategy'
  | ''; // This is to handle the cases where the strategyName is not set in a round, mostly spam rounds
export type RoundVisibilityType = 'public' | 'private';

// Note: this also exists in `common` and not able to import from there due to circular dependency.
export enum RoundCategory {
  QuadraticFunding,
  Direct,
}

export type ApplicationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'IN_REVIEW'
  | 'REJECTED'
  | 'APPEAL'
  | 'FRAUD'
  | 'RECEIVED'
  | 'CANCELLED';

export type ProjectType = 'CANONICAL' | 'LINKED';

export interface GrantApplicationFormAnswer {
  questionId: number;
  question: string;
  answer: string | string[];
  hidden: boolean;
  type?: string;
}

export interface ProjectOwner {
  address: string;
}

export interface ProjectMetadata {
  title: string;
  description: string;
  website: string;
  bannerImg?: string;
  logoImg?: string;
  projectTwitter?: string;
  userGithub?: string;
  projectGithub?: string;
  credentials: any;
  owners: ProjectOwner[];
  createdAt: number;
  lastUpdated: number;
}

export interface ProgramMetadata {
  name: string;
  type: string;
}

export interface AddressAndRole {
  address: string;
  role: string;
  createdAtBlock: string;
  // updatedAtBlock: string;
}

/**
 * The project type for v1
 *
 * @remarks
 *
 * This is more of the Application snapshot of the project at the time of the application.
 *
 * @deprecated - This type is deprecated and should not be used for new projects.
 */
export interface Project {
  grantApplicationId: string;
  projectRegistryId: string;
  anchorAddress?: string;
  recipient: string;
  projectMetadata: ProjectMetadata;
  grantApplicationFormAnswers: GrantApplicationFormAnswer[];
  status: ApplicationStatus;
  applicationIndex: number;
}

/**
 * The project role type for v2
 *
 * @remarks
 *
 * This is the type for v2 project roles which get created on Allo as `Profiles`.
 *
 * @example
 *
 * ```ts
 * const projectRole: ProjectRole = {
 *  project: {
 *   chainId: 1,
 *   createdAtBlock: 1,
 *   registryAddress: "0x123",
 *   projectNumber: 1,
 *   tags: ["allo-v2"],
 *  },
 *   projectId: "0x123",
 * };
 *
 * ```
 */
export interface ProjectRole {
  project: {
    chainId: number;
    createdAtBlock: number;
    registryAddress: string;
    projectNumber: number;
    tags: string[];
  };
  projectId: string;
}

export interface ProjectApplicationMetadata {
  signature: string;
  application: {
    round: string;
    answers: {
      type: string;
      hidden: boolean;
      question: string;
      questionId: number;
      encryptedAnswer?: {
        ciphertext: string;
        encryptedSymmetricKey: string;
      };
    }[];
    project: ProjectMetadata;
    recipient: string;
  };
}

/**
 * The round type with applications for v1
 **/

export type RoundWithApplications = Omit<RoundGetRound, 'applications'> & {
  applications: Application[];
};

export type RoundForExplorer = Omit<RoundGetRound, 'applications'> & {
  applications: Application[];
  uniqueDonorsCount?: number;
};

/**
 * The project application type for v2
 *
 */
export interface ProjectApplication {
  id: string;
  projectId: string;
  chainId: number;
  roundId: string;
  status: ApplicationStatus;
  metadataCid: string;
  metadata: ProjectApplicationMetadata;
  totalDonationsCount: number;
  totalAmountDonatedInUsd: number;
  uniqueDonorsCount: number;
  distributionTransaction: string | null;
}

export type ProjectApplicationForManager = ProjectApplication & {
  anchorAddress: Address;
  statusSnapshots: {
    status: ApplicationStatus;
    updatedAtBlock: string;
    updatedAt: string;
  }[];
  round: {
    strategyName: string;
    strategyAddress: string;
  };
  canonicalProject: {
    roles: { address: Address }[];
  };
};

export type ProjectApplicationWithRound = ProjectApplication & {
  anchorAddress: Address;
  round: {
    applicationsStartTime: string;
    applicationsEndTime: string;
    donationsStartTime: string;
    donationsEndTime: string;
    roundMetadata: RoundMetadata;
    name: string;
    strategyName: RoundPayoutType;
  };
};

export type ProjectApplicationWithRoundAndProgram = ProjectApplication & {
  anchorAddress: Address;
  round: {
    applicationsStartTime: string;
    applicationsEndTime: string;
    donationsStartTime: string;
    donationsEndTime: string;
    roundMetadata: RoundMetadata;
    project: {
      name: string;
    };
    strategyName: RoundPayoutType;
  };
};

/**
 * V2 Round
 */
export interface V2Round {
  id: string;
  chainId: number;
  applicationsStartTime: string;
  applicationsEndTime: string;
  donationsStartTime: string;
  donationsEndTime: string;
  matchTokenAddress: string;
  roundMetadata: RoundMetadata | null;
  roundMetadataCid: string;
  applicationMetadata: any | null;
  applicationMetadataCid: string;
  strategyId: string;
  projectId: string;
  strategyAddress: Address;
  strategyName: string;
  readyForPayoutTransaction: string | null;
  tags: string[];
}

/**
 * V2 Round with project
 */
export type V2RoundWithProject = V2RoundWithRoles & {
  project: {
    id: string;
    name: string;
    metadata: ProgramMetadata;
  };
};

export interface DistributionMatch {
  projectId: string;
  projectName: string;
  applicationId: string;
  anchorAddress: string;
  matchPoolPercentage: number;
  contributionsCount: number;
  matchAmountInToken: string;
  projectPayoutAddress: string;
  originalMatchAmountInToken: string;
}

export type RoundForManager = V2RoundWithProject & {
  matchingDistribution: {
    matchingDistribution: DistributionMatch[];
  } | null;
  tags: string[];
  matchAmount: string;
  matchAmountInUsd: number;
  fundedAmount: string;
  fundedAmountInUsd: number;
};

export interface ProjectApplicationWithProject {
  id: string;
  name: string;
}

export type V2RoundWithRoles = V2Round & {
  roles: AddressAndRole[];
  createdByAddress: string;
};

export interface ProjectEvents {
  createdAtBlock: number | undefined;
  updatedAtBlock: number | undefined;
}

export type ProjectEventsMap = Record<string, ProjectEvents>;

export interface PayoutStrategy {
  id: string;
  /**
   * Whether is QUADRATIC FUNDING or DIRECT GRANT
   * MERKLE for QF
   * DIRECT for DG
   */
  strategyName: RoundPayoutType;
}

export interface MetadataPointer {
  /**
   * The decentralized storage protocol
   * Read more here: https://github.com/gitcoinco/grants-round/blob/main/packages/contracts/docs/MetaPtrProtocol.md
   */
  protocol: number;
  /**
   * The identifier which represents the program metadata on a decentralized storage
   */
  pointer: string;
}

export interface Requirement {
  // Requirement for the round
  requirement?: string;
}

export interface Eligibility {
  // Eligibility for the round
  description: string;
  // Requirements for the round
  requirements?: Requirement[];
}

export type SybilDefense = 'passport' | 'passport-mbds' | 'none';

export interface Round {
  /**
   * The on-chain unique round ID
   */
  id?: string;
  /**
   * The chain ID of the network
   */
  chainId?: number;
  /**
   * Metadata of the Round to be stored off-chain
   */
  roundMetadata?: {
    name: string;
    roundType?: RoundVisibilityType;
    eligibility: Eligibility;
    programContractAddress: string;
    quadraticFundingConfig?: {
      matchingFundsAvailable: number;
      matchingCap: boolean;
      matchingCapAmount?: number;
      minDonationThreshold?: boolean;
      minDonationThresholdAmount?: number;
      sybilDefense?: SybilDefense | boolean; // this is to support both old and new sybil defense types.
    };
    support?: {
      type: string;
      info: string;
    };
  };
  /**
   * Pointer to round metadata in a decentralized storage e.g IPFS, Ceramic etc.
   */
  store?: MetadataPointer;
  /**
   * Pointer to application metadata in a decentralized storage e.g IPFS, Ceramic etc.
   */
  applicationStore?: MetadataPointer;
  /**
   * Helps identifying Round Types from QF and DG
   */
  payoutStrategy: PayoutStrategy;
  /**
   * Voting contract address
   */
  votingStrategy?: string;
  /**
   * Unix timestamp of the start of the round
   */
  roundStartTime: Date;
  /**
   * Unix timestamp of the end of the round
   */
  roundEndTime: Date;
  /**
   * Unix timestamp of when grants can apply to a round
   */
  applicationsStartTime: Date;
  /**
   * Unix timestamp after which grants cannot apply to a round
   */
  applicationsEndTime: Date;
  /**
   * Contract address of the token used to payout match amounts at the end of a round
   */
  token: string;

  /**
   * Contract address of the program to which the round belongs
   */
  ownedBy?: string;
  /**
   * Addresses of wallets that will have admin privileges to operate the Grant program
   */
  operatorWallets?: string[];
  /**
   * List of projects approved for the round
   */
  approvedProjects?: Project[];
  uniqueDonorsCount?: number;
}

export interface TimeFilter {
  greaterThan?: string;
  lessThan?: string;
  greaterThanOrEqualTo?: string;
  lessThanOrEqualTo?: string;
  isNull?: boolean;
}

export interface TimeFilterVariables {
  applicationsStartTime?: TimeFilter;
  applicationsEndTime?: TimeFilter;
  donationsStartTime?: TimeFilter;
  donationsEndTime?: TimeFilter;
  or?: TimeFilterVariables[];
}

export interface RoundsQueryVariables {
  first?: number;
  orderBy?: OrderByRounds;
  filter?: {
    and: (
      | { or: TimeFilterVariables[] }
      | { or: { strategyName: { in: string[] } } }
      | {
          or: {
            chainId: {
              in: number[];
            };
          };
        }
      | {
          tags: {
            contains: 'allo-v1' | 'allo-v2';
          };
        }
    )[];
  };
}

export interface RoundOverview {
  id: string;
  chainId: number;
  createdAt: string;
  roundMetaPtr: MetadataPointer;
  applicationMetaPtr: MetadataPointer;
  applicationsStartTime: string;
  applicationsEndTime: string;
  roundStartTime: string;
  roundEndTime: string;
  matchAmount: string;
  token: string;
  roundMetadata?: RoundMetadata;
  projects?: { id: string }[];
  payoutStrategy: {
    id: string;
    strategyName: RoundPayoutType;
  };
}

/**
 * Shape of IPFS content of Round RoundMetaPtr
 */
export interface RoundMetadata {
  name: string;
  roundType: RoundVisibilityType;
  eligibility: Eligibility;
  programContractAddress: string;
  support?: {
    info: string;
    type: string;
  };
}

export interface SearchBasedProjectCategory {
  id: string;
  name: string;
  images: string[];
  searchQuery: string;
}

export interface ExpandedApplicationRef {
  chainId: number;
  roundId: string;
  id: string;
}

export interface Collection {
  id: string;
  author: string;
  name: string;
  images: string[];
  description: string;
  applicationRefs: string[];
}

export interface RoundGetRound {
  id: string;
  tags: string[];
  chainId: number;
  ownedBy?: string;
  createdAtBlock: number;
  roundMetadataCid: string;
  roundMetadata: RoundMetadataGetRound;
  applicationsStartTime: string;
  applicationsEndTime: string;
  donationsStartTime: string;
  donationsEndTime: string;
  matchAmountInUsd: number;
  matchAmount: string;
  matchTokenAddress: string;
  strategyId: string;
  strategyName: RoundPayoutType;
  strategyAddress: string;
  applications: ApplicationWithId[];
}

export interface RoundMetadataGetRound {
  name: string;
  support?: Support;
  eligibility: Eligibility;
  feesAddress?: string;
  matchingFunds?: MatchingFunds;
  feesPercentage?: number;
  programContractAddress: string;
  quadraticFundingConfig?: QuadraticFundingConfig;
  roundType?: RoundVisibilityType;
}

export interface Support {
  info: string;
  type: string;
}

export interface MatchingFunds {
  matchingCap: boolean;
  matchingFundsAvailable: number;
}

export interface QuadraticFundingConfig {
  matchingCap: boolean;
  sybilDefense: SybilDefense | boolean;
  matchingCapAmount?: number;
  minDonationThreshold: boolean;
  matchingFundsAvailable: number;
  minDonationThresholdAmount?: number;
}

export interface ApplicationWithId {
  id: string;
}

export type OrderByRounds =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'CHAIN_ID_ASC'
  | 'CHAIN_ID_DESC'
  | 'TAGS_ASC'
  | 'TAGS_DESC'
  | 'MATCH_AMOUNT_ASC'
  | 'MATCH_AMOUNT_DESC'
  | 'MATCH_TOKEN_ADDRESS_ASC'
  | 'MATCH_TOKEN_ADDRESS_DESC'
  | 'MATCH_AMOUNT_IN_USD_ASC'
  | 'MATCH_AMOUNT_IN_USD_DESC'
  | 'APPLICATION_METADATA_CID_ASC'
  | 'APPLICATION_METADATA_CID_DESC'
  | 'APPLICATION_METADATA_ASC'
  | 'APPLICATION_METADATA_DESC'
  | 'ROUND_METADATA_CID_ASC'
  | 'ROUND_METADATA_CID_DESC'
  | 'ROUND_METADATA_ASC'
  | 'ROUND_METADATA_DESC'
  | 'APPLICATIONS_START_TIME_ASC'
  | 'APPLICATIONS_START_TIME_DESC'
  | 'APPLICATIONS_END_TIME_ASC'
  | 'APPLICATIONS_END_TIME_DESC'
  | 'DONATIONS_START_TIME_ASC'
  | 'DONATIONS_START_TIME_DESC'
  | 'DONATIONS_END_TIME_ASC'
  | 'DONATIONS_END_TIME_DESC'
  | 'CREATED_AT_BLOCK_ASC'
  | 'CREATED_AT_BLOCK_DESC'
  | 'UPDATED_AT_BLOCK_ASC'
  | 'UPDATED_AT_BLOCK_DESC'
  | 'MANAGER_ROLE_ASC'
  | 'MANAGER_ROLE_DESC'
  | 'ADMIN_ROLE_ASC'
  | 'ADMIN_ROLE_DESC'
  | 'STRATEGY_ADDRESS_ASC'
  | 'STRATEGY_ADDRESS_DESC'
  | 'STRATEGY_ID_ASC'
  | 'STRATEGY_ID_DESC'
  | 'STRATEGY_NAME_ASC'
  | 'STRATEGY_NAME_DESC'
  | 'PROJECT_ID_ASC'
  | 'PROJECT_ID_DESC'
  | 'TOTAL_AMOUNT_DONATED_IN_USD_ASC'
  | 'TOTAL_AMOUNT_DONATED_IN_USD_DESC'
  | 'TOTAL_DONATIONS_COUNT_ASC'
  | 'TOTAL_DONATIONS_COUNT_DESC'
  | 'UNIQUE_DONORS_COUNT_ASC'
  | 'UNIQUE_DONORS_COUNT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

export interface Application {
  id: string;
  chainId: string;
  roundId: string;
  projectId: string;
  status: ApplicationStatus;
  totalAmountDonatedInUsd: number;
  totalDonationsCount: string;
  uniqueDonorsCount: number;
  anchorAddress?: string;
  round: {
    strategyName: RoundPayoutType;
    donationsStartTime: string;
    donationsEndTime: string;
    applicationsStartTime: string;
    applicationsEndTime: string;
    roundMetadata: RoundMetadata;
    matchTokenAddress: string;
    tags: string[];
  };
  project: {
    id: string;
    metadata: ProjectMetadata;
    anchorAddress?: string;
  };
  metadata: {
    application: {
      recipient: string;
      answers: GrantApplicationFormAnswer[];
    };
  };
}

export interface Contribution {
  id: string;
  chainId: number;
  projectId: string;
  roundId: string;
  recipientAddress: string;
  applicationId: string;
  tokenAddress: string;
  donorAddress: string;
  amount: string;
  amountInUsd: number;
  transactionHash: string;
  blockNumber: number;
  round: {
    roundMetadata: RoundMetadata;
    donationsStartTime: string;
    donationsEndTime: string;
  };
  application: {
    project: {
      name: string;
    };
  };
  timestamp: string;
}

export interface Payout {
  id: string;
  tokenAddress: string;
  amount: string;
  amountInUsd: number;
  transactionHash: string;
  timestamp: string;
  sender: string;
}

export interface RoundApplicationPayout {
  id: string;
  applications: [
    {
      id: string;
      applicationsPayoutsByChainIdAndRoundIdAndApplicationId: Payout[];
    },
  ];
}

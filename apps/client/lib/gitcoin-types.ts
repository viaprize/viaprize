export interface MetaPtr {
  pointer: string;
  protocol: string | null; // Assuming protocol can be null
}

export interface Proof {
  jws: string;
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
}

export interface TwitterCredential {
  type: string[];
  proof: Proof;
  issuer: string;
  '@context': string[];
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    hash: string;
    '@context': {
      hash: string;
      provider: string;
    }[];
    provider: string;
  };
}

export interface Credentials {
  twitter: TwitterCredential;
  // You can add other credentials types here if needed
}

export interface ProjectMetadata {
  id: string;
  title: string;
  logoImg: string;
  metaPtr: MetaPtr;
  website: string;
  createdAt: number;
  userGithub: string;
  credentials: Credentials;
  description: string;
  lastUpdated: number;
  projectGithub: string;
  projectTwitter: string;
  bannerImg: string;
}

export interface Project {
  projectNumber: number;
  tags: string[];
  name: string;
  projectType: string;
  createdByAddress: string;
}


export interface ApplicationMetadata {
  signature: string;
  application: {
    round: string;
    project: ProjectMetadata;
    recipient: string;
  };
}

export interface StatusSnapshot {
  status: string;
  updatedAt: string;
  updatedAtBlock: string;
}

export interface Application {
  chainId: number;
  anchorAddress: string | null;
  createdAtBlock: string;
  createdByAddress: string;
  distributionTransaction: string;
  roundId: string;
  status: string;
  statusSnapshots: StatusSnapshot[];
  statusUpdatedAtBlock: string;
  totalAmountDonatedInUsd: number;
  tags: string[];
  totalDonationsCount: number;
  uniqueDonorsCount: number;
  nodeId: string;
  project: {
    name: string;
  };
  metadata: ApplicationMetadata;
}

export interface RoundByNodeIdResponse {
  roundByNodeId: {
    id: string;
    applications: Application[];
  };
}

export interface SingleApplication {
  id: string;
  nodeId: string;
  status: string;
  totalAmountDonatedInUsd: number;
  totalDonationsCount: number;
  uniqueDonorsCount: number;
  metadataCid: string;
  metadata: ApplicationMetadata;
  project: Project;
}

export interface ApplicationByNodeIdResponse {
  applicationByNodeId: SingleApplication;
}



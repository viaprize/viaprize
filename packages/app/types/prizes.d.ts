interface Proposal {
    voting_time: number;
    submission_time: number;
    admins: string[];
    description: string;
    proposer_address: string;
    isAutomatic: boolean;
    startVotingDate?: string;
    startSubmissionDate?: string;
    proficiencies: string[];
    priorities: string[];
    files: File[];
  }
  
import { Submission } from '../entities/submission.entity';

export interface FetchSubmissionDto extends Submission {
  submissionDeadline: number;
}

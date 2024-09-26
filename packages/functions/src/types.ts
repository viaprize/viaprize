export type ScheduleType =
  | 'wallet.transaction'
  | 'wallet.startSubmission'
  | 'prize.endSubmissionAndStartVoting'
  | 'wallet.endSubmissionAndStartVoting'
  | 'wallet.endVoting'
  | 'wallet.endDispute'

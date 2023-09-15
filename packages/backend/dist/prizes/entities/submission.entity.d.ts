import { User } from 'src/users/entities/user.entity';
import { Prize } from './prize.entity';
export declare class Submission {
    id: string;
    submissionTitle: string;
    subimissionDescription: string;
    user: User;
    prize: Prize;
}

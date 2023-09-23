export interface AppUser extends User {}

export declare class User {
  id: string;
  email: string;
  user_id: string;
  name: string;
  isAdmin: boolean;
  submissions: any[];
  prizeProposals: any[];
}

export class CreateUserDto {
  email: string;
  user_id: string;
  name: string;
  username: string;
}

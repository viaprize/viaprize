export interface AppUser extends User {
  falseValue: boolean; // This is just to test the type remove it later
}

export interface User {
  id: string;
  email: string;
  user_id: string;
  name: string;
  isAdmin: boolean;
  submissions: any[];
  prizeProposals: any[];
}

export interface CreateUserDto {
  email: string;
  user_id: string;
  name: string;
  username: string;
}

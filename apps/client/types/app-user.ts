export interface AppUser extends User {
  falseValue: boolean; // This is just to test the type remove it later
}

export interface User {
  id: string;
  email: string;
  authId: string;
  name: string;
  isAdmin: boolean;
  submissions: any[];
  prizeProposals: any[];
}

export interface CreateUserDto {
  email: string;
  authId: string;
  name: string;
  username: string;
}

export interface UserPublic {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface User extends UserPublic {
  email: string;
  bio?: string;
  location?: string;
  createdAt: string;
}

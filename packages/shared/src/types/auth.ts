export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

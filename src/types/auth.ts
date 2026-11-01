export interface User {
  id: string;
  username: string;
  passwordHash: string;
  pinHash?: string;
  pinEnabled: boolean;
  createdAt: number;
}

export interface Session {
  userId: string;
  username: string;
  issuedAt: number;
  expiresAt: number;
  remember: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface SetupCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

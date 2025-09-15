export interface iRefreshToken {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  revoked: boolean;
}
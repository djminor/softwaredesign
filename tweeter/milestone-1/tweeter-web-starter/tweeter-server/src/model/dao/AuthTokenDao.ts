// AI-assisted: see AI-ATTRIBUTION.md

export interface AuthTokenRecord {
  readonly token: string;
  readonly alias: string;
  readonly timestamp: number;
}

export interface AuthTokenDao {
  putToken(tokenRecord: AuthTokenRecord): Promise<void>;
  getToken(token: string): Promise<AuthTokenRecord | null>;
  updateTokenTimestamp(token: string, timestamp: number): Promise<void>;
  deleteToken(token: string): Promise<void>;
}

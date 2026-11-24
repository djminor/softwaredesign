// AI-assisted: see AI-ATTRIBUTION.md

export interface UserRecord {
  readonly alias: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly passwordHash: string;
  readonly imageUrl: string;
  readonly followerCount: number;
  readonly followeeCount: number;
}

export interface UserDao {
  getUser(alias: string): Promise<UserRecord | null>;
  putUser(user: UserRecord): Promise<void>;
  updateFollowCounts(
    alias: string,
    followerCountDelta: number,
    followeeCountDelta: number
  ): Promise<[followerCount: number, followeeCount: number]>;
  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
}

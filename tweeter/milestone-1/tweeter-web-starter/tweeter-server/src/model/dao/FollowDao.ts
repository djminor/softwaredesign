// AI-assisted: see AI-ATTRIBUTION.md
import { DataPage } from "./DataPage";

export interface FollowRecord {
  readonly follower_handle: string;
  readonly followee_handle: string;
  readonly follower_name?: string;
  readonly followee_name?: string;
}

export interface FollowDao {
  putFollow(followRecord: FollowRecord): Promise<void>;
  deleteFollow(followerHandle: string, followeeHandle: string): Promise<void>;
  isFollower(followerHandle: string, followeeHandle: string): Promise<boolean>;
  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<FollowRecord>>;
  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<FollowRecord>>;
  getAllFollowerHandles(followeeHandle: string): Promise<string[]>;
}

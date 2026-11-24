// AI-assisted: see AI-ATTRIBUTION.md
import { DaoFactory } from "../DaoFactory";
import { UserDao, UserRecord } from "../UserDao";
import { AuthTokenDao, AuthTokenRecord } from "../AuthTokenDao";
import { FollowDao, FollowRecord } from "../FollowDao";
import { StoryDao, StatusRecord } from "../StoryDao";
import { FeedDao } from "../FeedDao";
import { S3Dao } from "../S3Dao";
import { S3StorageDao } from "../s3/S3StorageDao";
import { DataPage } from "../DataPage";

// Initial skeleton implementations (will be fully implemented in upcoming commits)
class DynamoUserDaoStub implements UserDao {
  async getUser(alias: string): Promise<UserRecord | null> {
    throw new Error("Not implemented yet");
  }
  async putUser(user: UserRecord): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async updateFollowCounts(
    alias: string,
    followerCountDelta: number,
    followeeCountDelta: number
  ): Promise<[followerCount: number, followeeCount: number]> {
    throw new Error("Not implemented yet");
  }
  async getFollowerCount(alias: string): Promise<number> {
    throw new Error("Not implemented yet");
  }
  async getFolloweeCount(alias: string): Promise<number> {
    throw new Error("Not implemented yet");
  }
}

class DynamoAuthTokenDaoStub implements AuthTokenDao {
  async putToken(tokenRecord: AuthTokenRecord): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async getToken(token: string): Promise<AuthTokenRecord | null> {
    throw new Error("Not implemented yet");
  }
  async updateTokenTimestamp(token: string, timestamp: number): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async deleteToken(token: string): Promise<void> {
    throw new Error("Not implemented yet");
  }
}

class DynamoFollowDaoStub implements FollowDao {
  async putFollow(followRecord: FollowRecord): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async deleteFollow(
    followerHandle: string,
    followeeHandle: string
  ): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async isFollower(
    followerHandle: string,
    followeeHandle: string
  ): Promise<boolean> {
    throw new Error("Not implemented yet");
  }
  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<FollowRecord>> {
    throw new Error("Not implemented yet");
  }
  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<FollowRecord>> {
    throw new Error("Not implemented yet");
  }
  async getAllFollowerHandles(followeeHandle: string): Promise<string[]> {
    throw new Error("Not implemented yet");
  }
}

class DynamoStoryDaoStub implements StoryDao {
  async putStoryItem(status: StatusRecord): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusRecord>> {
    throw new Error("Not implemented yet");
  }
}

class DynamoFeedDaoStub implements FeedDao {
  async putFeedItem(receiverAlias: string, status: StatusRecord): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async batchPutFeedItems(
    receiverAliases: string[],
    status: StatusRecord
  ): Promise<void> {
    throw new Error("Not implemented yet");
  }
  async getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusRecord>> {
    throw new Error("Not implemented yet");
  }
}

export class DynamoDaoFactory implements DaoFactory {
  private userDao: UserDao = new DynamoUserDaoStub();
  private authTokenDao: AuthTokenDao = new DynamoAuthTokenDaoStub();
  private followDao: FollowDao = new DynamoFollowDaoStub();
  private storyDao: StoryDao = new DynamoStoryDaoStub();
  private feedDao: FeedDao = new DynamoFeedDaoStub();
  private s3Dao: S3Dao = new S3StorageDao();

  public getUserDao(): UserDao {
    return this.userDao;
  }

  public getAuthTokenDao(): AuthTokenDao {
    return this.authTokenDao;
  }

  public getFollowDao(): FollowDao {
    return this.followDao;
  }

  public getStoryDao(): StoryDao {
    return this.storyDao;
  }

  public getFeedDao(): FeedDao {
    return this.feedDao;
  }

  public getS3Dao(): S3Dao {
    return this.s3Dao;
  }
}

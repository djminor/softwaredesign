// AI-assisted: see AI-ATTRIBUTION.md
import { DaoFactory } from "../DaoFactory";
import { UserDao } from "../UserDao";
import { AuthTokenDao, AuthTokenRecord } from "../AuthTokenDao";
import { FollowDao, FollowRecord } from "../FollowDao";
import { StoryDao, StatusRecord } from "../StoryDao";
import { FeedDao } from "../FeedDao";
import { S3Dao } from "../S3Dao";
import { S3StorageDao } from "../s3/S3StorageDao";
import { DynamoUserDao } from "./DynamoUserDao";
import { DynamoAuthTokenDao } from "./DynamoAuthTokenDao";
import { DataPage } from "../DataPage";

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
  private userDao: UserDao = new DynamoUserDao();
  private authTokenDao: AuthTokenDao = new DynamoAuthTokenDao();
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

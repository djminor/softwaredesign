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
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoStoryDao } from "./DynamoStoryDao";
import { DynamoFeedDao } from "./DynamoFeedDao";

export class DynamoDaoFactory implements DaoFactory {
  private userDao: UserDao = new DynamoUserDao();
  private authTokenDao: AuthTokenDao = new DynamoAuthTokenDao();
  private followDao: FollowDao = new DynamoFollowDao();
  private storyDao: StoryDao = new DynamoStoryDao();
  private feedDao: FeedDao = new DynamoFeedDao();
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

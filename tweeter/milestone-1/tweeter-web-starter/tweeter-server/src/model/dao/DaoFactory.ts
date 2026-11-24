// AI-assisted: see AI-ATTRIBUTION.md
import { UserDao } from "./UserDao";
import { AuthTokenDao } from "./AuthTokenDao";
import { FollowDao } from "./FollowDao";
import { StoryDao } from "./StoryDao";
import { FeedDao } from "./FeedDao";
import { S3Dao } from "./S3Dao";

export interface DaoFactory {
  getUserDao(): UserDao;
  getAuthTokenDao(): AuthTokenDao;
  getFollowDao(): FollowDao;
  getStoryDao(): StoryDao;
  getFeedDao(): FeedDao;
  getS3Dao(): S3Dao;
}

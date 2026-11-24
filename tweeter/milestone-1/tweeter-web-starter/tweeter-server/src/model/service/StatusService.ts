// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory, DynamoDaoFactory, StatusRecord } from "../dao";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService implements Service {
  private readonly daoFactory: DaoFactory;
  private readonly authService: AuthorizationService;

  constructor(
    daoFactory: DaoFactory = new DynamoDaoFactory(),
    authService?: AuthorizationService
  ) {
    this.daoFactory = daoFactory;
    this.authService = authService ?? new AuthorizationService(this.daoFactory);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if (!userAlias) {
      throw new Error("[Bad Request] Missing user alias");
    }
    if (!pageSize || pageSize <= 0) {
      throw new Error("[Bad Request] Invalid page size");
    }

    await this.authService.validateToken(token);

    const storyDao = this.daoFactory.getStoryDao();
    const lastTimestamp = lastItem ? lastItem.timestamp : undefined;
    const page = await storyDao.getPageOfStory(
      userAlias,
      pageSize,
      lastTimestamp
    );

    const items = page.values.map((record) => record.statusDto);
    return [items, page.hasMorePages];
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if (!userAlias) {
      throw new Error("[Bad Request] Missing user alias");
    }
    if (!pageSize || pageSize <= 0) {
      throw new Error("[Bad Request] Invalid page size");
    }

    await this.authService.validateToken(token);

    const feedDao = this.daoFactory.getFeedDao();
    const lastTimestamp = lastItem ? lastItem.timestamp : undefined;
    const page = await feedDao.getPageOfFeed(
      userAlias,
      pageSize,
      lastTimestamp
    );

    const items = page.values.map((record) => record.statusDto);
    return [items, page.hasMorePages];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    if (!newStatus || !newStatus.post || !newStatus.user) {
      throw new Error("[Bad Request] Missing status to post");
    }

    await this.authService.validateToken(token);

    const storyDao = this.daoFactory.getStoryDao();
    const followDao = this.daoFactory.getFollowDao();
    const feedDao = this.daoFactory.getFeedDao();

    const statusRecord: StatusRecord = {
      sender_alias: newStatus.user.alias,
      timestamp: newStatus.timestamp,
      post: newStatus.post,
      statusDto: newStatus,
    };

    // 1. Post to author's story
    await storyDao.putStoryItem(statusRecord);

    // 2. Fan-out to all followers' feeds
    const followerHandles = await followDao.getAllFollowerHandles(
      newStatus.user.alias
    );

    if (followerHandles.length > 0) {
      await feedDao.batchPutFeedItems(followerHandles, statusRecord);
    }
  }
}

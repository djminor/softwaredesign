// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory, DynamoDaoFactory } from "../dao";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService implements Service {
  private readonly daoFactory: DaoFactory;
  private readonly authService: AuthorizationService;

  constructor(
    daoFactory: DaoFactory = new DynamoDaoFactory(),
    authService?: AuthorizationService
  ) {
    this.daoFactory = daoFactory;
    this.authService = authService ?? new AuthorizationService(this.daoFactory);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if (!userAlias) {
      throw new Error("[Bad Request] Missing user alias");
    }
    if (!pageSize || pageSize <= 0) {
      throw new Error("[Bad Request] Invalid page size");
    }

    await this.authService.validateToken(token);

    const followDao = this.daoFactory.getFollowDao();
    const userDao = this.daoFactory.getUserDao();

    const lastFolloweeHandle = lastItem ? lastItem.alias : undefined;
    const page = await followDao.getPageOfFollowees(
      userAlias,
      pageSize,
      lastFolloweeHandle
    );

    const users = await Promise.all(
      page.values.map(async (record) => {
        const user = await userDao.getUser(record.followee_handle);
        if (user) {
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageUrl: user.imageUrl,
          };
        }
        return {
          firstName: record.followee_name ?? "",
          lastName: "",
          alias: record.followee_handle,
          imageUrl: "",
        };
      })
    );

    return [users, page.hasMorePages];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if (!userAlias) {
      throw new Error("[Bad Request] Missing user alias");
    }
    if (!pageSize || pageSize <= 0) {
      throw new Error("[Bad Request] Invalid page size");
    }

    await this.authService.validateToken(token);

    const followDao = this.daoFactory.getFollowDao();
    const userDao = this.daoFactory.getUserDao();

    const lastFollowerHandle = lastItem ? lastItem.alias : undefined;
    const page = await followDao.getPageOfFollowers(
      userAlias,
      pageSize,
      lastFollowerHandle
    );

    const users = await Promise.all(
      page.values.map(async (record) => {
        const user = await userDao.getUser(record.follower_handle);
        if (user) {
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageUrl: user.imageUrl,
          };
        }
        return {
          firstName: record.follower_name ?? "",
          lastName: "",
          alias: record.follower_handle,
          imageUrl: "",
        };
      })
    );

    return [users, page.hasMorePages];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}

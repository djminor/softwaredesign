// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
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
    if (!user || !user.alias || !selectedUser || !selectedUser.alias) {
      throw new Error("[Bad Request] Missing user or selectedUser");
    }

    await this.authService.validateToken(token);

    const followDao = this.daoFactory.getFollowDao();
    return await followDao.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    if (!user || !user.alias) {
      throw new Error("[Bad Request] Missing user");
    }

    await this.authService.validateToken(token);

    const userDao = this.daoFactory.getUserDao();
    return await userDao.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    if (!user || !user.alias) {
      throw new Error("[Bad Request] Missing user");
    }

    await this.authService.validateToken(token);

    const userDao = this.daoFactory.getUserDao();
    return await userDao.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!userToFollow || !userToFollow.alias) {
      throw new Error("[Bad Request] Missing user to follow");
    }

    const authRecord = await this.authService.validateToken(token);
    if (authRecord.alias === userToFollow.alias) {
      throw new Error("[Bad Request] Cannot follow yourself");
    }

    const followDao = this.daoFactory.getFollowDao();
    const userDao = this.daoFactory.getUserDao();

    const alreadyFollowing = await followDao.isFollower(
      authRecord.alias,
      userToFollow.alias
    );

    if (!alreadyFollowing) {
      await followDao.putFollow({
        follower_handle: authRecord.alias,
        followee_handle: userToFollow.alias,
        follower_name: undefined,
        followee_name: `${userToFollow.firstName} ${userToFollow.lastName}`,
      });

      // Increment follower's followee count
      await userDao.updateFollowCounts(authRecord.alias, 0, 1);

      // Increment followee's follower count
      const [followerCount, followeeCount] = await userDao.updateFollowCounts(
        userToFollow.alias,
        1,
        0
      );

      return [Math.max(0, followerCount), Math.max(0, followeeCount)];
    }

    const followerCount = await userDao.getFollowerCount(userToFollow.alias);
    const followeeCount = await userDao.getFolloweeCount(userToFollow.alias);
    return [Math.max(0, followerCount), Math.max(0, followeeCount)];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!userToUnfollow || !userToUnfollow.alias) {
      throw new Error("[Bad Request] Missing user to unfollow");
    }

    const authRecord = await this.authService.validateToken(token);
    if (authRecord.alias === userToUnfollow.alias) {
      throw new Error("[Bad Request] Cannot unfollow yourself");
    }

    const followDao = this.daoFactory.getFollowDao();
    const userDao = this.daoFactory.getUserDao();

    const isFollowing = await followDao.isFollower(
      authRecord.alias,
      userToUnfollow.alias
    );

    if (isFollowing) {
      await followDao.deleteFollow(authRecord.alias, userToUnfollow.alias);

      // Decrement follower's followee count
      await userDao.updateFollowCounts(authRecord.alias, 0, -1);

      // Decrement followee's follower count
      const [followerCount, followeeCount] = await userDao.updateFollowCounts(
        userToUnfollow.alias,
        -1,
        0
      );

      return [Math.max(0, followerCount), Math.max(0, followeeCount)];
    }

    const followerCount = await userDao.getFollowerCount(userToUnfollow.alias);
    const followeeCount = await userDao.getFolloweeCount(userToUnfollow.alias);
    return [Math.max(0, followerCount), Math.max(0, followeeCount)];
  }
}

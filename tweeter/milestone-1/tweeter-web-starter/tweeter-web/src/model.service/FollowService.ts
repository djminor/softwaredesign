// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, PagedUserItemRequest, IsFollowerRequest, FollowCountRequest, FollowToggleRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowees (
          authToken: AuthToken,
          userAlias: string,
          pageSize: number,
          lastItem: User | null
        ): Promise<[User[], boolean]> {
          const request: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
          };
          return this.serverFacade.getMoreFollowees(request);
        };
      public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem == null ? null : lastItem.dto,
        };
        return this.serverFacade.getMoreFollowers(request);
      };

    public async getIsFollowerStatus (
      authToken: AuthToken,
      user: User,
      selectedUser: User,
    ): Promise<boolean> {
      const request: IsFollowerRequest = {
        token: authToken.token,
        user: user.dto,
        selectedUser: selectedUser.dto,
      };
      return this.serverFacade.getIsFollowerStatus(request);
    };

    public async getFolloweeCount (
      authToken: AuthToken,
      user: User,
    ): Promise<number> {
      const request: FollowCountRequest = {
        token: authToken.token,
        user: user.dto,
      };
      return this.serverFacade.getFolloweeCount(request);
    };

    public async getFollowerCount (
      authToken: AuthToken,
      user: User,
    ): Promise<number> {
      const request: FollowCountRequest = {
        token: authToken.token,
        user: user.dto,
      };
      return this.serverFacade.getFollowerCount(request);
    };

    public async follow (
      authToken: AuthToken,
      userToFollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
      const request: FollowToggleRequest = {
        token: authToken.token,
        user: userToFollow.dto,
      };
      return this.serverFacade.follow(request);
    };

    public async unfollow (
      authToken: AuthToken,
      userToUnfollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
      const request: FollowToggleRequest = {
        token: authToken.token,
        user: userToUnfollow.dto,
      };
      return this.serverFacade.unfollow(request);
    };
}

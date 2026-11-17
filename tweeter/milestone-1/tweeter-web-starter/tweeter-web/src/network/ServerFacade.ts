// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthenticateResponse,
  AuthToken,
  FollowCountRequest,
  FollowCountResponse,
  FollowToggleRequest,
  FollowToggleResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  RegisterRequest,
  Status,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://TODO_SERVER_URL";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get followees");
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get followers");
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/status");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get follower status");
    }
  }

  public async getFolloweeCount(
    request: FollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/followee/count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get followee count");
    }
  }

  public async getFollowerCount(
    request: FollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/follower/count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get follower count");
    }
  }

  public async follow(
    request: FollowToggleRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowToggleRequest,
      FollowToggleResponse
    >(request, "/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to follow user");
    }
  }

  public async unfollow(
    request: FollowToggleRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowToggleRequest,
      FollowToggleResponse
    >(request, "/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to unfollow user");
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    if (response.success) {
      return User.fromDto(response.user);
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get user");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, "/user/login");

    if (response.success && response.user && response.authToken) {
      return [
        User.fromDto(response.user)!,
        AuthToken.fromDto(response.authToken)!,
      ];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to login");
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthenticateResponse
    >(request, "/user/register");

    if (response.success && response.user && response.authToken) {
      return [
        User.fromDto(response.user)!,
        AuthToken.fromDto(response.authToken)!,
      ];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to register");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "Failed to logout");
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/feed");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error("No feed items found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get feed items");
    }
  }
}

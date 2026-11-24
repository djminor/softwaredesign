// AI-assisted: see AI-ATTRIBUTION.md
/**
 * @jest-environment node
 */
import "isomorphic-fetch";
import {
  AuthToken,
  FollowCountRequest,
  FollowToggleRequest,
  GetUserRequest,
  IsFollowerRequest,
  LoginRequest,
  LogoutRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("ServerFacade Integration Tests (Live DynamoDB & S3)", () => {
  jest.setTimeout(30000);

  const serverFacade = new ServerFacade();
  const timestamp = Date.now();
  const testAlias1 = `@test_${timestamp}_a`;
  const testAlias2 = `@test_${timestamp}_b`;
  const testPassword = "securePassword123!";

  // 1x1 transparent PNG base64 string
  const testImageBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  let user1: User;
  let authToken1: AuthToken;
  let user2: User;
  let authToken2: AuthToken;

  test("Register: successfully registers new users, uploads image to S3, and returns AuthToken", async () => {
    const registerReq1: RegisterRequest = {
      firstName: "Test",
      lastName: "UserOne",
      alias: testAlias1,
      password: testPassword,
      userImageBytes: testImageBase64,
      imageFileExtension: "png",
    };

    [user1, authToken1] = await serverFacade.register(registerReq1);

    expect(user1).toBeDefined();
    expect(user1).toBeInstanceOf(User);
    expect(user1.alias).toBe(testAlias1);
    expect(user1.firstName).toBe("Test");
    expect(user1.lastName).toBe("UserOne");
    expect(user1.imageUrl).toContain("s3");

    expect(authToken1).toBeDefined();
    expect(authToken1).toBeInstanceOf(AuthToken);
    expect(authToken1.token).toBeTruthy();

    const registerReq2: RegisterRequest = {
      firstName: "Test",
      lastName: "UserTwo",
      alias: testAlias2,
      password: testPassword,
      userImageBytes: testImageBase64,
      imageFileExtension: "png",
    };

    [user2, authToken2] = await serverFacade.register(registerReq2);
    expect(user2.alias).toBe(testAlias2);
    expect(authToken2.token).toBeTruthy();
  });

  test("Login: successfully authenticates with valid credentials", async () => {
    const loginReq: LoginRequest = {
      alias: testAlias1,
      password: testPassword,
    };

    const [loggedInUser, newAuthToken] = await serverFacade.login(loginReq);

    expect(loggedInUser).toBeDefined();
    expect(loggedInUser.alias).toBe(testAlias1);
    expect(newAuthToken).toBeDefined();
    expect(newAuthToken.token).toBeTruthy();
  });

  test("Login: fails with invalid password", async () => {
    const badLoginReq: LoginRequest = {
      alias: testAlias1,
      password: "wrongPassword!",
    };

    await expect(serverFacade.login(badLoginReq)).rejects.toThrow();
  });

  test("GetUser: successfully retrieves user by alias", async () => {
    const getUserReq: GetUserRequest = {
      token: authToken1.token,
      alias: testAlias1,
    };

    const fetchedUser = await serverFacade.getUser(getUserReq);
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser?.alias).toBe(testAlias1);
    expect(fetchedUser?.firstName).toBe("Test");
    expect(fetchedUser?.lastName).toBe("UserOne");
  });

  test("Follow & Unfollow: updates follow relationship and atomic counts", async () => {
    // Check initial follower count of user2
    const countReqInitial: FollowCountRequest = {
      token: authToken1.token,
      user: user2.dto,
    };
    const initialFollowerCount = await serverFacade.getFollowerCount(
      countReqInitial
    );

    // Follow user2
    const followReq: FollowToggleRequest = {
      token: authToken1.token,
      user: user2.dto,
    };
    const [followerCountAfterFollow] = await serverFacade.follow(followReq);
    expect(followerCountAfterFollow).toBe(initialFollowerCount + 1);

    // Verify isFollower status
    const isFollowerReq: IsFollowerRequest = {
      token: authToken1.token,
      user: user1.dto,
      selectedUser: user2.dto,
    };
    const isFollowing = await serverFacade.getIsFollowerStatus(isFollowerReq);
    expect(isFollowing).toBe(true);

    // Unfollow user2
    const unfollowReq: FollowToggleRequest = {
      token: authToken1.token,
      user: user2.dto,
    };
    const [followerCountAfterUnfollow] = await serverFacade.unfollow(
      unfollowReq
    );
    expect(followerCountAfterUnfollow).toBe(initialFollowerCount);

    // Verify isFollower status is now false
    const isFollowingAfter = await serverFacade.getIsFollowerStatus(
      isFollowerReq
    );
    expect(isFollowingAfter).toBe(false);
  });

  test("GetFollowers and GetFollowees: retrieves paginated lists", async () => {
    const followersReq: PagedUserItemRequest = {
      token: authToken1.token,
      userAlias: testAlias1,
      pageSize: 5,
      lastItem: null,
    };

    const [followers, hasMoreFollowers] = await serverFacade.getMoreFollowers(
      followersReq
    );
    expect(Array.isArray(followers)).toBe(true);
    expect(typeof hasMoreFollowers).toBe("boolean");

    const followeesReq: PagedUserItemRequest = {
      token: authToken1.token,
      userAlias: testAlias1,
      pageSize: 5,
      lastItem: null,
    };

    const [followees, hasMoreFollowees] = await serverFacade.getMoreFollowees(
      followeesReq
    );
    expect(Array.isArray(followees)).toBe(true);
    expect(typeof hasMoreFollowees).toBe("boolean");
  });

  test("Logout: invalidates session token so subsequent requests fail", async () => {
    const logoutReq: LogoutRequest = {
      token: authToken1.token,
    };

    await serverFacade.logout(logoutReq);

    // Verify token is deleted and cannot be used for authenticated requests
    const getUserReq: GetUserRequest = {
      token: authToken1.token,
      alias: testAlias1,
    };

    await expect(serverFacade.getUser(getUserReq)).rejects.toThrow();
  });
});

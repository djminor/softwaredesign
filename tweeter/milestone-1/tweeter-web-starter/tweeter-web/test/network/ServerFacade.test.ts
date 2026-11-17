// AI-assisted: see AI-ATTRIBUTION.md
/**
 * @jest-environment node
 */
import {
  AuthToken,
  FollowCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  test("Register: successfully registers a new user and returns User and AuthToken", async () => {
    const request: RegisterRequest = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      password: "password",
      userImageBytes: "imagebytes",
      imageFileExtension: "png",
    };

    const [user, authToken] = await serverFacade.register(request);

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBeTruthy();
    expect(user.lastName).toBeTruthy();
    expect(user.alias).toBeTruthy();
    expect(user.imageUrl).toBeTruthy();

    expect(authToken).toBeDefined();
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.token).toBeTruthy();
  });

  test("GetFollowers: successfully retrieves a page of followers", async () => {
    const request: PagedUserItemRequest = {
      token: "dummy-token",
      userAlias: "@allen",
      pageSize: 5,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(followers).toBeDefined();
    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThan(0);
    expect(followers[0]).toBeInstanceOf(User);
    expect(followers[0].alias).toBeTruthy();
    expect(typeof hasMore).toBe("boolean");
  });

  test("GetFolloweeCount and GetFollowerCount: successfully retrieves follower and followee counts", async () => {
    const testUserDto: UserDto = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
    };

    const request: FollowCountRequest = {
      token: "dummy-token",
      user: testUserDto,
    };

    const followeeCount = await serverFacade.getFolloweeCount(request);
    expect(typeof followeeCount).toBe("number");
    expect(followeeCount).toBeGreaterThanOrEqual(0);

    const followerCount = await serverFacade.getFollowerCount(request);
    expect(typeof followerCount).toBe("number");
    expect(followerCount).toBeGreaterThanOrEqual(0);
  });
});

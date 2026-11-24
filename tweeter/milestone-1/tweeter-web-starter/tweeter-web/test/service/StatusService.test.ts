// AI-assisted: see AI-ATTRIBUTION.md
/**
 * @jest-environment node
 */
import "isomorphic-fetch";
import { AuthToken, RegisterRequest, Status, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import { StatusService } from "../../src/model.service/StatusService";

describe("StatusService Integration Tests (Live DynamoDB Story & Feed)", () => {
  jest.setTimeout(30000);

  const serverFacade = new ServerFacade();
  const statusService = new StatusService();

  const timestamp = Date.now();
  const authorAlias = `@author_${timestamp}`;
  const followerAlias = `@follower_${timestamp}`;
  const password = "password123!";

  const testImageBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  let authorUser: User;
  let authorToken: AuthToken;
  let followerUser: User;
  let followerToken: AuthToken;

  beforeAll(async () => {
    // Register author
    const regAuthor: RegisterRequest = {
      firstName: "Story",
      lastName: "Author",
      alias: authorAlias,
      password: password,
      userImageBytes: testImageBase64,
      imageFileExtension: "png",
    };
    [authorUser, authorToken] = await serverFacade.register(regAuthor);

    // Register follower
    const regFollower: RegisterRequest = {
      firstName: "Feed",
      lastName: "Follower",
      alias: followerAlias,
      password: password,
      userImageBytes: testImageBase64,
      imageFileExtension: "png",
    };
    [followerUser, followerToken] = await serverFacade.register(regFollower);

    // Follower follows author so author's posts fan out to follower's feed
    await serverFacade.follow({
      token: followerToken.token,
      user: authorUser.dto,
    });
  });

  test("postStatus & loadMoreStoryItems: posts status to story and retrieves it", async () => {
    const postText = `Hello world from story test ${Date.now()}`;
    const newStatus = new Status(postText, authorUser, Date.now());

    await statusService.postStatus(authorToken, newStatus);

    // Retrieve story items
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      authorToken,
      authorAlias,
      5,
      null
    );

    expect(storyItems).toBeDefined();
    expect(Array.isArray(storyItems)).toBe(true);
    expect(storyItems.length).toBeGreaterThan(0);
    expect(storyItems[0]).toBeInstanceOf(Status);
    expect(storyItems[0].post).toBe(postText);
    expect(storyItems[0].user.alias).toBe(authorAlias);
    expect(typeof hasMore).toBe("boolean");
  });

  test("loadMoreFeedItems: follower receives author's status in pre-computed feed", async () => {
    const [feedItems, hasMore] = await statusService.loadMoreFeedItems(
      followerToken,
      followerAlias,
      5,
      null
    );

    expect(feedItems).toBeDefined();
    expect(Array.isArray(feedItems)).toBe(true);
    expect(feedItems.length).toBeGreaterThan(0);
    expect(feedItems[0]).toBeInstanceOf(Status);
    expect(feedItems[0].user.alias).toBe(authorAlias);
    expect(typeof hasMore).toBe("boolean");
  });
});

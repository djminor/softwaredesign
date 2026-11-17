// AI-assisted: see AI-ATTRIBUTION.md
/**
 * @jest-environment node
 */
import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("StatusService Integration Tests", () => {
  const statusService = new StatusService();

  test("loadMoreStoryItems: successfully retrieves a page of story items", async () => {
    const authToken = new AuthToken("dummy-token", Date.now());
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "@allen",
      5,
      null
    );

    expect(storyItems).toBeDefined();
    expect(Array.isArray(storyItems)).toBe(true);
    expect(storyItems.length).toBeGreaterThan(0);
    expect(storyItems[0]).toBeInstanceOf(Status);
    expect(storyItems[0].post).toBeTruthy();
    expect(storyItems[0].user).toBeDefined();
    expect(typeof hasMore).toBe("boolean");
  });
});

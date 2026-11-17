// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, PagedStatusItemRequest, Status, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
    private serverFacade = new ServerFacade();

    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        const request: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
        };
        return this.serverFacade.getMoreStoryItems(request);
      };

    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const request: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
        };
        return this.serverFacade.getMoreFeedItems(request);
    };

    public async getUser (
            authToken: AuthToken,
            alias: string
          ): Promise<User | null> {
            // TODO: Replace with the result of calling server
            return FakeData.instance.findUserByAlias(alias);
    };

    public async postStatus (
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}

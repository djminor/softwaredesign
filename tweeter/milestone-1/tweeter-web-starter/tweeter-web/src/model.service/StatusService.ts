// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, PagedStatusItemRequest, PostStatusRequest, Status, User } from "tweeter-shared";
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
            return this.serverFacade.getUser({ token: authToken.token, alias });
    };

    public async postStatus (
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };
    return this.serverFacade.postStatus(request);
  };
}

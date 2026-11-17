// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, Status, StatusDto, User } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(
            Status.fromDto(lastItem),
            pageSize
        );
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    };

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(
            Status.fromDto(lastItem),
            pageSize
        );
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    };

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status,
    ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
    };
}

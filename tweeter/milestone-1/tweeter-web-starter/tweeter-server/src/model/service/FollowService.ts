import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
    };
    private getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(this.getDomainObject(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => this.createDto(user));
        return Promise.resolve([dtos, hasMore]);
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(this.getDomainObject(lastItem), pageSize, userAlias);
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User,
    ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    };

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
    };

    public async getFollowerCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
    };

    private createDto(user: User): UserDto {
        return {firstName: user.firstName, lastName: user.lastName, imageUrl: user.imageUrl, alias: user.alias}
    }

    private getDomainObject(dto: UserDto | null): User | null {
        return dto == null ? null : new User(dto.firstName, dto.lastName, dto.imageUrl, dto.alias);
    }
}
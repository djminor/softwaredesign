// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        const user = FakeData.instance.findUserByAlias(alias);
        return user === null ? null : user.dto;
    };

    public async logout(token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    };
}

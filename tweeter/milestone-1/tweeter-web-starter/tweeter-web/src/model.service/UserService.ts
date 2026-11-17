// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, GetUserRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
    private serverFacade = new ServerFacade();

    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        const request: GetUserRequest = {
            token: authToken.token,
            alias: alias,
        };
        return this.serverFacade.getUser(request);
    };

    public async logout (authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    };
}

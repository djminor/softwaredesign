// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, GetUserRequest, LogoutRequest } from "tweeter-shared";
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
        const request: LogoutRequest = {
            token: authToken.token,
        };
        return this.serverFacade.logout(request);
    };
}

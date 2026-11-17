// AI-assisted: see AI-ATTRIBUTION.md
import { User, AuthToken, LoginRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class LoginService implements Service {
    private serverFacade = new ServerFacade();

    public async login (
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const request: LoginRequest = {
            alias: alias,
            password: password,
        };
        return this.serverFacade.login(request);
    };
}

// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class LoginService implements Service {
    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    };
}

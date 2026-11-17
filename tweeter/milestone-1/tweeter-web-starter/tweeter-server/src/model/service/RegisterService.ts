// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class RegisterService implements Service {
    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    };
}

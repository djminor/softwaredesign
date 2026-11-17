// AI-assisted: see AI-ATTRIBUTION.md
import { Buffer } from "buffer";
import { User, AuthToken, RegisterRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class RegisterService implements Service {
    private serverFacade = new ServerFacade();

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");

        const request: RegisterRequest = {
            firstName,
            lastName,
            alias,
            password,
            userImageBytes: imageStringBase64,
            imageFileExtension,
        };

        return this.serverFacade.register(request);
    };
}

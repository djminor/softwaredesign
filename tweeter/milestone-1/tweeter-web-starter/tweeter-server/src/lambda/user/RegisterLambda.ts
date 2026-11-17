// AI-assisted: see AI-ATTRIBUTION.md
import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { RegisterService } from "../../model/service/RegisterService";

export const handler = async (request: RegisterRequest): Promise<AuthenticateResponse> => {
    const registerService = new RegisterService();
    const [userDto, authTokenDto] = await registerService.register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        request.userImageBytes,
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: userDto,
        authToken: authTokenDto,
    };
};

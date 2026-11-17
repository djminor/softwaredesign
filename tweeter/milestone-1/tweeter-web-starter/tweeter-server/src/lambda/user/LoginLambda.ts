// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { LoginService } from "../../model/service/LoginService";

export const handler = async (request: LoginRequest): Promise<AuthenticateResponse> => {
    const loginService = new LoginService();
    const [userDto, authTokenDto] = await loginService.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user: userDto,
        authToken: authTokenDto,
    };
};

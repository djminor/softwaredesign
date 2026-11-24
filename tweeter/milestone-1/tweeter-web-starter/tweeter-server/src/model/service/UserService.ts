// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory, DynamoDaoFactory } from "../dao";
import { AuthorizationService } from "./AuthorizationService";

export class UserService implements Service {
  private readonly daoFactory: DaoFactory;
  private readonly authService: AuthorizationService;

  constructor(
    daoFactory: DaoFactory = new DynamoDaoFactory(),
    authService?: AuthorizationService
  ) {
    this.daoFactory = daoFactory;
    this.authService = authService ?? new AuthorizationService(this.daoFactory);
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    if (!alias) {
      throw new Error("[Bad Request] Missing required user alias");
    }

    // Validate session token (enforces 30-minute expiration and sliding window)
    await this.authService.validateToken(token);

    const userDao = this.daoFactory.getUserDao();
    const userRecord = await userDao.getUser(alias);

    if (userRecord === null) {
      return null;
    }

    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      alias: userRecord.alias,
      imageUrl: userRecord.imageUrl,
    };
  }

  public async logout(token: string): Promise<void> {
    // Delete session token to log out
    await this.authService.deleteToken(token);
  }
}

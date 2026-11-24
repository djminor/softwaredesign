// AI-assisted: see AI-ATTRIBUTION.md
import bcrypt from "bcryptjs";
import { User, AuthToken, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory, DynamoDaoFactory } from "../dao";

export class LoginService implements Service {
  private readonly daoFactory: DaoFactory;

  constructor(daoFactory: DaoFactory = new DynamoDaoFactory()) {
    this.daoFactory = daoFactory;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    if (!alias || !password) {
      throw new Error("[Bad Request] Missing required login fields");
    }

    const userDao = this.daoFactory.getUserDao();
    const userRecord = await userDao.getUser(alias);

    if (userRecord === null) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    const passwordMatches = await bcrypt.compare(
      password,
      userRecord.passwordHash
    );

    if (!passwordMatches) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    const authToken = AuthToken.Generate();
    const authTokenDao = this.daoFactory.getAuthTokenDao();
    await authTokenDao.putToken({
      token: authToken.token,
      alias: userRecord.alias,
      timestamp: authToken.timestamp,
    });

    const user = new User(
      userRecord.firstName,
      userRecord.lastName,
      userRecord.alias,
      userRecord.imageUrl
    );

    return [user.dto, authToken.dto];
  }
}

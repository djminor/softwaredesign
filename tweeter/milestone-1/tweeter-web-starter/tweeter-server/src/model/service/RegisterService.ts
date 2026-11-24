// AI-assisted: see AI-ATTRIBUTION.md
import bcrypt from "bcryptjs";
import { User, AuthToken, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory, DynamoDaoFactory, UserRecord } from "../dao";

export class RegisterService implements Service {
  private readonly daoFactory: DaoFactory;

  constructor(daoFactory: DaoFactory = new DynamoDaoFactory()) {
    this.daoFactory = daoFactory;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    if (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !userImageBytes ||
      !imageFileExtension
    ) {
      throw new Error("[Bad Request] Missing required registration fields");
    }

    const userDao = this.daoFactory.getUserDao();
    const existingUser = await userDao.getUser(alias);
    if (existingUser !== null) {
      throw new Error(`[Bad Request] User already exists with alias: ${alias}`);
    }

    // Hash password with bcryptjs
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Upload profile image to S3
    const cleanedExtension = imageFileExtension.startsWith(".")
      ? imageFileExtension.substring(1)
      : imageFileExtension;
    const fileName = `${alias}.${cleanedExtension}`;
    const s3Dao = this.daoFactory.getS3Dao();
    const imageUrl = await s3Dao.putImage(fileName, userImageBytes);

    // Save user record in DynamoDB
    const userRecord: UserRecord = {
      alias,
      firstName,
      lastName,
      passwordHash,
      imageUrl,
      followerCount: 0,
      followeeCount: 0,
    };
    await userDao.putUser(userRecord);

    // Generate and persist auth token
    const authToken = AuthToken.Generate();
    const authTokenDao = this.daoFactory.getAuthTokenDao();
    await authTokenDao.putToken({
      token: authToken.token,
      alias,
      timestamp: authToken.timestamp,
    });

    const user = new User(firstName, lastName, alias, imageUrl);
    return [user.dto, authToken.dto];
  }
}

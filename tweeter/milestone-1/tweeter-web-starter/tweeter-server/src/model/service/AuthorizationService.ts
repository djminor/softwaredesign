// AI-assisted: see AI-ATTRIBUTION.md
import { Service } from "./Service";
import { DaoFactory, DynamoDaoFactory, AuthTokenRecord } from "../dao";

export class AuthorizationService implements Service {
  public static readonly SESSION_TIMEOUT_MS: number = 30 * 60 * 1000; // 30 minutes
  private readonly daoFactory: DaoFactory;

  constructor(daoFactory: DaoFactory = new DynamoDaoFactory()) {
    this.daoFactory = daoFactory;
  }

  /**
   * Validates that the provided token exists, has not expired (within 30 minutes),
   * and slides the expiration window forward by updating the timestamp.
   *
   * @param token The session token string to validate.
   * @returns The updated AuthTokenRecord if valid.
   * @throws Error with '[Bad Request]' prefix if missing, invalid, or expired.
   */
  public async validateToken(
    token: string | null | undefined
  ): Promise<AuthTokenRecord> {
    if (!token) {
      throw new Error("[Bad Request] No auth token provided");
    }

    const authTokenDao = this.daoFactory.getAuthTokenDao();
    const tokenRecord = await authTokenDao.getToken(token);

    if (!tokenRecord) {
      throw new Error("[Bad Request] Invalid auth token");
    }

    const now = Date.now();
    if (now - tokenRecord.timestamp > AuthorizationService.SESSION_TIMEOUT_MS) {
      try {
        await authTokenDao.deleteToken(token);
      } catch {
        // Suppress cleanup error to prioritize reporting expiration
      }
      throw new Error("[Bad Request] Auth token expired");
    }

    // Slide the session expiration window forward
    await authTokenDao.updateTokenTimestamp(token, now);

    return {
      token: tokenRecord.token,
      alias: tokenRecord.alias,
      timestamp: now,
    };
  }

  /**
   * Deletes the specified token from persistence (used during logout).
   *
   * @param token The token string to delete.
   */
  public async deleteToken(token: string | null | undefined): Promise<void> {
    if (!token) {
      throw new Error("[Bad Request] No auth token provided");
    }

    const authTokenDao = this.daoFactory.getAuthTokenDao();
    await authTokenDao.deleteToken(token);
  }
}

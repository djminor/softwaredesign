// AI-assisted: see AI-ATTRIBUTION.md
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDao, UserRecord } from "../UserDao";
import { DynamoClient } from "./DynamoClient";

export class DynamoUserDao implements UserDao {
  private readonly tableName: string;

  constructor(tableName: string = process.env.USERS_TABLE || "users") {
    this.tableName = tableName;
  }

  public async getUser(alias: string): Promise<UserRecord | null> {
    const client = DynamoClient.getClient();
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { alias },
    });

    const response = await client.send(command);
    if (!response.Item) {
      return null;
    }

    return {
      alias: response.Item.alias,
      firstName: response.Item.firstName,
      lastName: response.Item.lastName,
      passwordHash: response.Item.passwordHash,
      imageUrl: response.Item.imageUrl,
      followerCount: response.Item.followerCount ?? 0,
      followeeCount: response.Item.followeeCount ?? 0,
    };
  }

  public async putUser(user: UserRecord): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
        imageUrl: user.imageUrl,
        followerCount: user.followerCount ?? 0,
        followeeCount: user.followeeCount ?? 0,
      },
    });

    await client.send(command);
  }

  public async updateFollowCounts(
    alias: string,
    followerCountDelta: number,
    followeeCountDelta: number
  ): Promise<[followerCount: number, followeeCount: number]> {
    const client = DynamoClient.getClient();
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { alias },
      UpdateExpression:
        "ADD followerCount :followerDelta, followeeCount :followeeDelta",
      ExpressionAttributeValues: {
        ":followerDelta": followerCountDelta,
        ":followeeDelta": followeeCountDelta,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await client.send(command);
    const updated = response.Attributes;
    const followerCount = updated?.followerCount ?? 0;
    const followeeCount = updated?.followeeCount ?? 0;
    return [followerCount, followeeCount];
  }

  public async getFollowerCount(alias: string): Promise<number> {
    const user = await this.getUser(alias);
    return user ? user.followerCount : 0;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    const user = await this.getUser(alias);
    return user ? user.followeeCount : 0;
  }
}

// AI-assisted: see AI-ATTRIBUTION.md
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDao, AuthTokenRecord } from "../AuthTokenDao";
import { DynamoClient } from "./DynamoClient";

export class DynamoAuthTokenDao implements AuthTokenDao {
  private readonly tableName: string;

  constructor(
    tableName: string = process.env.AUTH_TOKENS_TABLE || "auth_tokens"
  ) {
    this.tableName = tableName;
  }

  public async putToken(tokenRecord: AuthTokenRecord): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        token: tokenRecord.token,
        alias: tokenRecord.alias,
        timestamp: tokenRecord.timestamp,
      },
    });

    await client.send(command);
  }

  public async getToken(token: string): Promise<AuthTokenRecord | null> {
    const client = DynamoClient.getClient();
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { token },
    });

    const response = await client.send(command);
    if (!response.Item) {
      return null;
    }

    return {
      token: response.Item.token,
      alias: response.Item.alias,
      timestamp: response.Item.timestamp,
    };
  }

  public async updateTokenTimestamp(
    token: string,
    timestamp: number
  ): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { token },
      UpdateExpression: "SET #ts = :timestamp",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":timestamp": timestamp,
      },
    });

    await client.send(command);
  }

  public async deleteToken(token: string): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { token },
    });

    await client.send(command);
  }
}

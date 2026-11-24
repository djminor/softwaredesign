// AI-assisted: see AI-ATTRIBUTION.md
import {
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { StoryDao, StatusRecord } from "../StoryDao";
import { DataPage } from "../DataPage";
import { DynamoClient } from "./DynamoClient";

export class DynamoStoryDao implements StoryDao {
  private readonly tableName: string;

  constructor(tableName: string = process.env.STORIES_TABLE || "stories") {
    this.tableName = tableName;
  }

  public async putStoryItem(status: StatusRecord): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        sender_alias: status.sender_alias,
        timestamp: status.timestamp,
        post: status.post,
        statusDto: status.statusDto,
      },
    });

    await client.send(command);
  }

  public async getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusRecord>> {
    const client = DynamoClient.getClient();
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "sender_alias = :alias",
      ExpressionAttributeValues: {
        ":alias": senderAlias,
      },
      ScanIndexForward: false,
      Limit: pageSize,
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        sender_alias: senderAlias,
        timestamp: lastTimestamp,
      };
    }

    const response = await client.send(new QueryCommand(params));
    const items: StatusRecord[] = (response.Items ?? []).map((item) => ({
      sender_alias: item.sender_alias,
      timestamp: item.timestamp,
      post: item.post,
      statusDto: item.statusDto,
    }));

    const hasMorePages = response.LastEvaluatedKey !== undefined;
    return new DataPage<StatusRecord>(items, hasMorePages);
  }
}

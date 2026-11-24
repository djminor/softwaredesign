// AI-assisted: see AI-ATTRIBUTION.md
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { FeedDao } from "../FeedDao";
import { StatusRecord } from "../StoryDao";
import { DataPage } from "../DataPage";
import { DynamoClient } from "./DynamoClient";

export class DynamoFeedDao implements FeedDao {
  private readonly tableName: string;

  constructor(tableName: string = process.env.FEEDS_TABLE || "feeds") {
    this.tableName = tableName;
  }

  public async putFeedItem(
    receiverAlias: string,
    status: StatusRecord
  ): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        receiver_alias: receiverAlias,
        timestamp: status.timestamp,
        post: status.post,
        sender_alias: status.sender_alias,
        statusDto: status.statusDto,
      },
    });

    await client.send(command);
  }

  public async batchPutFeedItems(
    receiverAliases: string[],
    status: StatusRecord
  ): Promise<void> {
    if (!receiverAliases || receiverAliases.length === 0) {
      return;
    }

    const client = DynamoClient.getClient();

    // DynamoDB BatchWriteItem supports max 25 items per request
    const BATCH_SIZE = 25;
    for (let i = 0; i < receiverAliases.length; i += BATCH_SIZE) {
      const chunk = receiverAliases.slice(i, i + BATCH_SIZE);
      const writeRequests = chunk.map((alias) => ({
        PutRequest: {
          Item: {
            receiver_alias: alias,
            timestamp: status.timestamp,
            post: status.post,
            sender_alias: status.sender_alias,
            statusDto: status.statusDto,
          },
        },
      }));

      let params: BatchWriteCommandInput = {
        RequestItems: {
          [this.tableName]: writeRequests,
        },
      };

      // Loop with exponential backoff for any UnprocessedItems
      let attempts = 0;
      do {
        const response = await client.send(new BatchWriteCommand(params));
        const unprocessed = response.UnprocessedItems;

        if (
          unprocessed &&
          unprocessed[this.tableName] &&
          unprocessed[this.tableName].length > 0
        ) {
          attempts++;
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(100 * Math.pow(2, attempts), 2000))
          );
          params = {
            RequestItems: unprocessed,
          };
        } else {
          break;
        }
      } while (attempts < 10);
    }
  }

  public async getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusRecord>> {
    const client = DynamoClient.getClient();
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "receiver_alias = :alias",
      ExpressionAttributeValues: {
        ":alias": receiverAlias,
      },
      ScanIndexForward: false, // Newest first
      Limit: pageSize,
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        receiver_alias: receiverAlias,
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

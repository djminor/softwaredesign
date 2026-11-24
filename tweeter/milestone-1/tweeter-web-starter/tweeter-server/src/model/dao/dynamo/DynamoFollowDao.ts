// AI-assisted: see AI-ATTRIBUTION.md
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { FollowDao, FollowRecord } from "../FollowDao";
import { DataPage } from "../DataPage";
import { DynamoClient } from "./DynamoClient";

export class DynamoFollowDao implements FollowDao {
  private readonly tableName: string;
  private readonly indexName: string;

  constructor(
    tableName: string = process.env.FOLLOWS_TABLE || "follows",
    indexName: string = process.env.FOLLOWS_INDEX || "follows_index"
  ) {
    this.tableName = tableName;
    this.indexName = indexName;
  }

  public async putFollow(followRecord: FollowRecord): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        follower_handle: followRecord.follower_handle,
        followee_handle: followRecord.followee_handle,
        ...(followRecord.follower_name
          ? { follower_name: followRecord.follower_name }
          : {}),
        ...(followRecord.followee_name
          ? { followee_name: followRecord.followee_name }
          : {}),
      },
    });

    await client.send(command);
  }

  public async deleteFollow(
    followerHandle: string,
    followeeHandle: string
  ): Promise<void> {
    const client = DynamoClient.getClient();
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        follower_handle: followerHandle,
        followee_handle: followeeHandle,
      },
    });

    await client.send(command);
  }

  public async isFollower(
    followerHandle: string,
    followeeHandle: string
  ): Promise<boolean> {
    const client = DynamoClient.getClient();
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        follower_handle: followerHandle,
        followee_handle: followeeHandle,
      },
    });

    const response = await client.send(command);
    return response.Item !== undefined;
  }

  public async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<FollowRecord>> {
    const client = DynamoClient.getClient();
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "follower_handle = :handle",
      ExpressionAttributeValues: {
        ":handle": followerHandle,
      },
      Limit: pageSize,
    };

    if (lastFolloweeHandle) {
      params.ExclusiveStartKey = {
        follower_handle: followerHandle,
        followee_handle: lastFolloweeHandle,
      };
    }

    const response = await client.send(new QueryCommand(params));
    const items: FollowRecord[] = (response.Items ?? []).map((item) => ({
      follower_handle: item.follower_handle,
      followee_handle: item.followee_handle,
      follower_name: item.follower_name,
      followee_name: item.followee_name,
    }));

    const hasMorePages = response.LastEvaluatedKey !== undefined;
    return new DataPage<FollowRecord>(items, hasMorePages);
  }

  public async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<FollowRecord>> {
    const client = DynamoClient.getClient();
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "followee_handle = :handle",
      ExpressionAttributeValues: {
        ":handle": followeeHandle,
      },
      Limit: pageSize,
    };

    if (lastFollowerHandle) {
      params.ExclusiveStartKey = {
        followee_handle: followeeHandle,
        follower_handle: lastFollowerHandle,
      };
    }

    const response = await client.send(new QueryCommand(params));
    const items: FollowRecord[] = (response.Items ?? []).map((item) => ({
      follower_handle: item.follower_handle,
      followee_handle: item.followee_handle,
      follower_name: item.follower_name,
      followee_name: item.followee_name,
    }));

    const hasMorePages = response.LastEvaluatedKey !== undefined;
    return new DataPage<FollowRecord>(items, hasMorePages);
  }

  public async getAllFollowerHandles(
    followeeHandle: string
  ): Promise<string[]> {
    const client = DynamoClient.getClient();
    const followers: string[] = [];
    let lastKey: Record<string, any> | undefined = undefined;

    do {
      const params: QueryCommandInput = {
        TableName: this.tableName,
        IndexName: this.indexName,
        KeyConditionExpression: "followee_handle = :handle",
        ExpressionAttributeValues: {
          ":handle": followeeHandle,
        },
        ProjectionExpression: "follower_handle",
        ExclusiveStartKey: lastKey,
      };

      const response = await client.send(new QueryCommand(params));
      if (response.Items) {
        for (const item of response.Items) {
          if (item.follower_handle) {
            followers.push(item.follower_handle);
          }
        }
      }
      lastKey = response.LastEvaluatedKey;
    } while (lastKey !== undefined);

    return followers;
  }
}

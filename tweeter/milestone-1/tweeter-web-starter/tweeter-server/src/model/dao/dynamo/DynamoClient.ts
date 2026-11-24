// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoClient {
  private static instance: DynamoDBDocumentClient | null = null;

  public static getClient(): DynamoDBDocumentClient {
    if (!this.instance) {
      const region = process.env.AWS_REGION || "us-west-2";
      const ddbClient = new DynamoDBClient({ region });
      this.instance = DynamoDBDocumentClient.from(ddbClient, {
        marshallOptions: {
          removeUndefinedValues: true,
        },
      });
    }
    return this.instance;
  }
}

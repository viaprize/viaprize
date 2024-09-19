import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
export class Cache {
  client;
  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async get(key: string) {
    const res = await this.client.send(
      new QueryCommand({
        TableName: Resource.CacheTable.name,
        KeyConditionExpression: "#K = :key",
        ExpressionAttributeNames: {
          "#K": "key",
        },
        ExpressionAttributeValues: {
          ":key": key,
        },
        Limit: 1,
      })
    );
    return res.Items?.[0] ? (res.Items[0].value as string) : undefined;
  }

  async set(key: string, value: string, expireAt: number) {
    const expireAtUnixEpoch = Math.floor((Date.now() + expireAt * 1000) / 1000);
    const res = await this.client.send(
      new UpdateCommand({
        TableName: Resource.CacheTable.name,
        Key: {
          key,
        },
        UpdateExpression: "SET key = :c, expireAt = :e",
        ExpressionAttributeValues: {
          ":c": key,
          ":e": expireAtUnixEpoch,
        },
      })
    );
  }
}

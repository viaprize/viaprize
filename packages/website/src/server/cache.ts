import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
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

  async delete(key: string) {
    console.log("Deleting cache for key", key);

    await this.client.send(
      new DeleteCommand({
        TableName: Resource.CacheTable.name, // Ensure this is your table name

        Key: {
          key, // Primary key to identify the item to delete
        },
      })
    );

    console.log(`Cache for key ${key} deleted successfully.`);
  }

  async set(key: string, value: string, expireAt: number) {
    console.log("Setting cache", key, value, expireAt);
    console.log("Value", value, "Valuee", value.toString());
    const expireAtUnixEpoch = Math.floor((Date.now() + expireAt * 1000) / 1000);
    await this.client.send(
      new UpdateCommand({
        TableName: Resource.CacheTable.name,

        Key: {
          key,
        },
        ExpressionAttributeNames: {
          "#v": "value", // Use #k as a placeholder for the reserved word 'key'
        },
        UpdateExpression: "SET #v = :c, expireAt = :e",
        ExpressionAttributeValues: {
          ":c": value,
          ":e": expireAtUnixEpoch,
        },
      })
    );
  }
}

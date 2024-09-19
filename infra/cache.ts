export const cacheTable = new sst.aws.Dynamo("CacheTable", {
  fields: {
    key: "string",
    value: "string",
  },
  primaryIndex: { hashKey: "key" }, // Primary index uses hashKey, not partitionKey
  globalIndexes: {
    GSI1: {
      // Global Secondary Index (GSI) on "value"
      hashKey: "value", // Corrected property name
      projection: "all", // Defines what attributes are projected (can be "all", "keys-only", or specific attributes)
    },
  },
  ttl: "expireAt",
});

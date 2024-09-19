export const vpc =
  $app.stage === "production"
    ? new sst.aws.Vpc("ViaprizeVpcV2")
    : sst.aws.Vpc.get("ViaprizeVpcV2", "vpc-0ee4b214bcf13a942");

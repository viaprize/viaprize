export const vpc =
  $app.stage === "prod"
    ? new sst.aws.Vpc("ViaprizeVPC", {
        nat: "managed",
      })
    : sst.aws.Vpc.get("ViaprizeVPC", "vpc-0d3be7f08ac4bc049");

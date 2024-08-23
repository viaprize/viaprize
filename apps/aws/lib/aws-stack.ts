import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import {
  Effect,
  Policy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

export class CdkviaPrizeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const assetBucket = s3.Bucket.fromBucketName(
      this,
      "CustomAssetBucket",
      "viaprize-bucket-scheduler"
    );
    const assetKey = "your-custom-asset-key.zip";

    const schedulerOneOFFLambda = new lambda.Function(
      this,
      "viaPrizeSchedulerLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "scheduler.handler",
        code: lambda.Code.fromAsset(join(__dirname, "..", "lambda")),
      }
    );

    const schedulerRole = new Role(this, "viaPrizeSchedulerRole", {
      assumedBy: new ServicePrincipal("scheduler.amazonaws.com"),
    });

    const invokeLambdaPolicy = new Policy(this, "invokeLambdaPolicy", {
      document: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: ["lambda:InvokeFunction"],
            resources: [schedulerOneOFFLambda.functionArn],
            effect: Effect.ALLOW,
          }),
        ],
      }),
    });
    schedulerRole.attachInlinePolicy(invokeLambdaPolicy);

    new cdk.CfnOutput(this, "SchedulerLambdaArn", {
      value: schedulerOneOFFLambda.functionArn,
      exportName: "SchedulerLambdaArn",
    });

    new cdk.CfnOutput(this, "SchedulerRoleArn", {
      value: schedulerRole.roleArn,
      exportName: "SchedulerRoleArn",
    });
  }
}

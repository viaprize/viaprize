/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
import "sst"pe {}
declare module "sst" {
  export interface Resource {
    "AuthGithubId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AuthGithubSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AuthGoogleId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AuthGoogleSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AuthResendKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AuthSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AuthTrustHost": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "CacheTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "ChainId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DatabaseUrl": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "EventBus": {
      "arn": string
      "name": string
      "type": "sst.aws.Bus"
    }
    "ImageUploads": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "IndexerPrizeFactoryStartBlock": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "IndexerPrizeStartBlock": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "IndexerRpcUrl": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "NextPublicWalletConnectProjectId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    OpenAiApiKey: {
      type: 'sst.sst.Secret'
      value: string
    }
    RpcUrl: {
      type: 'sst.sst.Secret'
      value: string
    }
    "ScheduleReceivingLambda": {
      "arn": string
      "type": "sst.aws.Function"
    }
    "WalletApiKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "WalletPaymentInfraApi": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "schedulerRole": {
      "arn": string
      "type": "aws.iam/role.Role"
    }
    "website": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}

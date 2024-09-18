/* tslint:disable */
/* eslint-disable */
import "sst"
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
    "IndexerRpcUrl": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "IndexerService": {
      "type": "sst.aws.Service"
      "url": string
    }
    "NextPublicWalletConnectProjectId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "RpcUrl": {
      "type": "sst.sst.Secret"
      "value": string
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
export {}

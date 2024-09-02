/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "AuthSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "MyApi": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "website": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
export {}

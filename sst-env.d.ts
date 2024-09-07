/* tslint:disable */
/* eslint-disable */
import 'sst'
declare module 'sst' {
  export interface Resource {
    AuthGithubId: {
      type: 'sst.sst.Secret'
      value: string
    }
    AuthGithubSecret: {
      type: 'sst.sst.Secret'
      value: string
    }
    AuthGoogleId: {
      type: 'sst.sst.Secret'
      value: string
    }
    AuthGoogleSecret: {
      type: 'sst.sst.Secret'
      value: string
    }
    AuthResendKey: {
      type: 'sst.sst.Secret'
      value: string
    }
    AuthSecret: {
      type: 'sst.sst.Secret'
      value: string
    }

    DatabaseUrl: {
      type: 'sst.sst.Secret'
      value: string
    }
    MyApi: {
      name: string
      type: 'sst.aws.Function'
      url: string
    }

    AuthTrustHost: {
      type: 'sst.sst.Secret'
      value: string
    }
    DatabaseUrl: {
      type: 'sst.sst.Secret'
      value: string
    }
    NextPublicWalletConnectProjectId: {
      type: 'sst.sst.Secret'
      value: string
    }
    WalletPaymentInfraApi: {
      type: 'sst.sst.Secret'
      value: string
    }

    website: {
      type: 'sst.aws.Nextjs'
      url: string
    }
  }
}

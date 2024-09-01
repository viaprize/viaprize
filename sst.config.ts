/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'viaprize',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },
  async run() {
    await import('./infra/storage')
    const api = await import('./infra/api')
    // const web = new sst.aws.Nextjs("website-application", {
    //   path: "packages/web",
    // });

    return {
      api: api.myApi.url,
    }
  },
})

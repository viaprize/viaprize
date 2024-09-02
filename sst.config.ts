/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'viaprize',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          profile:
            input.stage === 'production'
              ? 'viaprize-production'
              : 'viaprize-dev',
        },
      },
    }
  },
  async run() {
    const api = await import('./infra/api')
    const website = await import('./infra/website')

    return {
      api: api.myApi.url,
      website: website.website.url,
    }
  },
})

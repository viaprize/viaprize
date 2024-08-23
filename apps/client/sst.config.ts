import { env } from '@env';
import type { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'client',
      region: 'us-west-1',
    };
  },
  stacks(app) {
    // const domain: SsrDomainProps | undefined =
    //   app.stage == 'prod'
    //     ? {
    //         domainName: 'viaprize.org',
    //         domainAlias: 'www.viaprize.org',
    //       }
    // : undefined;
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        environment: {
          ...env,
        },
        // customDomain: domain,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

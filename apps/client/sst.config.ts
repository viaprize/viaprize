import { SSTConfig } from 'sst';
import { Bucket, NextjsSite, Service } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'client',
      region: 'us-west-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const service = new Service(stack, 'service', {
        port: 3000,
      });
      const bucket = new Bucket(stack, 'public');

      const site = new NextjsSite(stack, 'site', {
        bind: [bucket],
      });

      stack.addOutputs({
        ServiceUrl: service.url,
      });
    });
  },
} satisfies SSTConfig;

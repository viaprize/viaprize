<<<<<<< HEAD
import { env } from "@env";
import { SSTConfig } from "sst";
import { Bucket, NextjsSite } from "sst/constructs";
=======
import { SSTConfig } from 'sst';
import { Bucket, NextjsSite, Service } from 'sst/constructs';
>>>>>>> 311586ed1c0225e2ed3a122e4913fa21b9b5427d

export default {
  config(_input) {
    return {
      name: 'client',
      region: 'us-west-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, "public");

      const site = new NextjsSite(stack, "site", {
        bind: [bucket],
        environment: {
          ...env
        }
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

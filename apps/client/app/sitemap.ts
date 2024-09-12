import type { MetadataRoute } from 'next';

const url = 'https://viaprize.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${url}/portal/about`,
    },
    {
      url: `${url}/portal/create`,
    },
    {
      url: `${url}/prize/create`,
    },
    {
      url: `${url}/prize/about`,
    },
    {
      url: `${url}/prize/explore`,
    },
    {
      url: `${url}/portal/explore`,
    },
    {
      url,
    },
  ];
}

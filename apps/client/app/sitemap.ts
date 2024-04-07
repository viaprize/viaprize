import { Api } from '@/lib/api';
import type { MetadataRoute } from 'next';

const url = 'https://viaprize.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portals = (
    await new Api().portals.portalsList(
      {
        limit: 15,
        page: 1,
      },
      {
        next: {
          revalidate: 0,
        },
      },
    )
  ).data.data;

  const prizes = (
    await new Api().prizes.prizesList(
      {
        limit: 10,
        page: 1,
      },
      {
        next: {
          revalidate: 0,
        },
      },
    )
  ).data.data;

  const portalsIndex: MetadataRoute.Sitemap = portals.map((portal) => ({
    url: `${url}/portal/${portal.id}`,
    lastModified: new Date(portal.updatedAt),
  }));

  const prizesIndex: MetadataRoute.Sitemap = prizes.map((prize) => ({
    url: `${url}/prize/${prize.id}`,
    lastModified: new Date(prize.updated_at),
  }));

  return [
    ...portalsIndex,
    ...prizesIndex,
    {
      url: `${url}/portal/about`,
    },
  ];
}

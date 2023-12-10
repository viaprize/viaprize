import { CreatePortalDto } from '@/lib/api';
import { backendApi } from '@/lib/backend';

export const usePortal = () => {
  const createPortal = async (portalDto: CreatePortalDto) => {
    const portal = await (await backendApi()).portals.portalsCreate(portalDto);
    return portal.data;
  };

  return { createPortal };
};

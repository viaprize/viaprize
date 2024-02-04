import { CreatePortalDto } from '@/lib/api';
import { backendApi } from '@/lib/backend';

export const usePortal = () => {
  const createPortal = async (portalDto: CreatePortalDto) => {
    const portal = await (await backendApi()).portals.portalsCreate(portalDto);
    return portal.data;
  };

  const addUpdatesToPortal = async ({
    portalId,
    update,
  }: {
    portalId: string;
    update: string;
  }) => {
    const portal = await (await backendApi()).portals.addUpdateUpdate(portalId, update);
    return portal.data;
  };
  return { createPortal, addUpdatesToPortal };
};

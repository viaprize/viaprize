import { backendApi } from '@/lib/backend';
import { useQuery } from 'react-query';

export default function AllPortals({ params }: { params: { id: string } }) {
  const { isLoading, data } = useQuery(['getPortalsOfUser', undefined], async () => {
    return (await backendApi()).portals.proposalsUserDetail(params.id);
  });

  return <div />;
}

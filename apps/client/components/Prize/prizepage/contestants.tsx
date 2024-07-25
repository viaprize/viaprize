import { usePrize } from '@/components/hooks/usePrize';
import { usePathname } from 'next/navigation';
import { useQuery } from 'react-query';
import PrizeFunderCard from './prizeFunderCard';

export default function Contestants() {
  const id = usePathname();
  const slug = id?.split('/')[2] as string;

  const { getContestants } = usePrize();
  const { data: contestants } = useQuery('contestants', () => getContestants(slug), {
    refetchInterval: 5000,
  });

  return (
    <section className="flex flex-col gap-2">
      {contestants?.length === 0 && <p>No contestants yet</p>}
      {contestants?.map((contestant) => (
        <PrizeFunderCard
          key={contestant.id}
          avatar={contestant.avatar}
          name={contestant.name}
          username={contestant.username}
        />
      ))}
    </section>
  );
}

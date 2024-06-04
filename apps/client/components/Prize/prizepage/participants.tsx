import { usePrize } from '@/components/hooks/usePrize';
import { usePathname } from 'next/navigation';
import { useQuery } from 'react-query';
import PrizeFunderCard from './prizeFunderCard';

export default function Participants() {
  const id = usePathname();
  const slug = id?.split('/')[2] as string;

  const { getParticipants } = usePrize();
  const { data: participants } = useQuery('participants', () => getParticipants(slug), {
    refetchInterval: 5000,
  });

  return (
    <section className="flex flex-col gap-2">
      {participants?.length === 0 && <p>No participants yet</p>}
      {participants?.map((participant) => (
        <PrizeFunderCard
          key={participant.id}
          avatar={participant.avatar}
          name={participant.name}
        />
      ))}
    </section>
  );
}

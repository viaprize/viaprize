import { fetchRoundByNodeId } from '@/lib/actions';

export default async function FetchExplore() {
  const applicationsInRound = await fetchRoundByNodeId(
    'WyJyb3VuZHMiLCIweDAwZDVlMGQzMWQzN2NjMTNjNjQ1ZDg2NDEwYWI0Y2I3Y2I0MjhjY2EiLDQyMTYxXQ==',
  );
  return <div />;
}

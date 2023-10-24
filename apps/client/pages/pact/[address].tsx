import HistoryItem from '@/components/HistoryItem';
import AppHeader from '@/components/layout/switchWallet';
import axio from '@/lib/axios';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PactDetail() {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { address } = router.query;

  const getPactDetail = async () => {
    const res = await axio.get('/pact', {
      params: {
        address,
      },
    });

    setItem(res);

    setLoading(false);
  };

  useEffect(() => {
    if (!address) {
      return;
    }

    getPactDetail().then(console.log).catch(console.error);
  }, [address]);

  return (
    <div className="pb-32">
      <AppHeader />
      <div className="max-w-[50%] mx-auto">
        {loading ? (
          <div className="text-4xl text-center mt-8">
            <Loader color="cyan" />;
          </div>
        ) : (
          <HistoryItem item={item} address={address} pictureVisible />
        )}
      </div>
    </div>
  );
}

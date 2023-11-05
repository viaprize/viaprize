import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import AppShellLayout from '@/components/layout/appshell';
import { Api, PrizeWithBlockchainData } from '@/lib/api';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { ReactElement } from 'react';

export default function PrizePage({
  prize,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex justify-center w-full">
      <PrizePageComponent prize={prize} />
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const data = (await new Api().prizes.prizesDetail(context.query.id as string)).data;
  return { props: { prize: data } };
}) satisfies GetServerSideProps<{
  prize: PrizeWithBlockchainData;
}>;

PrizePage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

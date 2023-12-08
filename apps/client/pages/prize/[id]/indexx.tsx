import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import AppShellLayout from '@/components/layout/appshell';
import { Api, PrizeWithBlockchainData, SubmissionWithBlockchainData } from '@/lib/api';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { ReactElement } from 'react';

export default function PrizePage({
  prize,
  submissions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex justify-center w-full">
      <PrizePageComponent prize={prize} submissions={submissions} />
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const data = (await new Api().prizes.prizesDetail(context.query.id as string)).data;
  const submissionsUptoFive = (
    await new Api().prizes.submissionDetail2(context.query.id as string, {
      limit: 5,
      page: 1,
    })
  ).data;
  return { props: { prize: data, submissions: submissionsUptoFive.data } };
}) satisfies GetServerSideProps<{
  prize: PrizeWithBlockchainData;
  submissions: SubmissionWithBlockchainData[];
}>;

PrizePage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

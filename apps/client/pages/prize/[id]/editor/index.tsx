import type { JSONContent } from '@tiptap/react';
import { Editor as NovalEditor } from 'novel';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { PrizeSubmissionTemplate } from '@/components/Prize/prizepage/defaultcontent';
import AppShellLayout from '@/components/layout/appshell';
import useAppUser from '@/context/hooks/useAppUser';
import { backendApi } from '@/lib/backend';
import {
  usePrepareViaPrizeAddSubmission,
  useViaPrizeAddSubmission,
} from '@/lib/smartContract';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

function EditorsPage() {
  const [content, setContent] = useState<JSONContent | undefined>(
    PrizeSubmissionTemplate,
  );
  const { appUser } = useAppUser();
  const { address } = useAccount();
  const router = useRouter();
  const { config } = usePrepareViaPrizeAddSubmission({
    account: address,
    address: router.query.contract as `0x${string}`,
    args: [address ? address : '0x', `${appUser?.id}${router.query.id as string}`],
  });
  console.log({ address });
  const { data:submissionData, writeAsync } = useViaPrizeAddSubmission({
    ...config,
    async onSuccess(data) {

      const waitForTransactionOut = await waitForTransaction({
        hash: data.hash,
        confirmations: 1,
      });
      console.log(waitForTransactionOut.logs[0].topics[2]);
      const hash = waitForTransactionOut.logs[0].topics[2];
      if (!hash) {
        throw Error('Hash is undefined');
      }
      const res = await (
        await backendApi()
      ).prizes.submissionCreate(router.query.id as string, {
        submissionDescription: JSON.stringify(content),
        submissionHash: hash as string,
        submitterAddress: address ?? '0x',
      });
      console.log({ res }, 'ressss');

      toast.promise(router.push(`/prize/${router.query.id as string}`), {
        loading: 'Redirecting please wait ',
        success: 'Submission Submitted',
        error: 'Error Submitting Proposal',
      });
    },
  });
  const submitToSmartContract = async () => {
    await writeAsync?.();

  };
  console.log({ submissionData }, 'submission hash');
  const onSumbit = () => {
    console.log('on sumbitttt');
    try {
      toast.promise(submitToSmartContract(), {
        loading: 'Submission In Progress',
        success: 'Submission Submitted',
        error: 'Error Submitting Proposal',
      });
    } catch {
      toast.error('Error Submitting Proposal');
    }
  };
  return (
    <div className="w-full flex justify-center my-3 relative">
      <div className="relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg">
        <NovalEditor
          className=""
          disableLocalStorage
          // className="relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 bg-white sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg"
          onUpdate={(e) => {
            setContent(e?.getJSON());
            console.log(e?.getJSON());
          }}
          defaultValue={content}
        />
        <button
          onClick={onSumbit}
          disabled={!writeAsync}
          className="py-3 px-4 bg-gray-800 text-white absolute bottom-5 right-5 rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

EditorsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

export default EditorsPage;

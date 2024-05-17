import type { JSONContent } from '@tiptap/react';
import { Editor as NovalEditor } from 'novel';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { PrizeSubmissionTemplate } from '@/components/Prize/prizepage/defaultcontent';
import useAppUser from '@/components/hooks/useAppUser';
import AppShellLayout from '@/components/layout/appshell';
import { backendApi } from '@/lib/backend';
import { prepareWritePrize, writePrize } from '@/lib/smartContract';
import { useWallets } from '@privy-io/react-auth';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

function EditorsPage() {
  const [content, setContent] = useState<JSONContent | undefined>(
    PrizeSubmissionTemplate,
  );
  const { appUser } = useAppUser();
  const { wallets } = useWallets();
  const router = useRouter();

  const submitToSmartContract = async () => {
    if (!wallets[0]) {
      throw Error('Wallet is undefined');
    }

    const address = wallets[0].address as `0x${string}`;
    // await writeAsync?.();
    const request = await prepareWritePrize({
      account: address,
      address: router.query.contract as `0x${string}`,
      args: [address ? address : '0x', `${appUser?.id}${router.query.slug as string}`],
      functionName: 'addSubmission',
    });
    const { hash } = await writePrize(request);
    const waitForTransactionOut = await waitForTransaction({
      hash: hash,
      confirmations: 1,
    });
    console.log(waitForTransactionOut.logs[0].topics[2]);
    const submissionHash = waitForTransactionOut.logs[0].topics[2];
    if (!submissionHash) {
      throw Error('Hash is undefined');
    }
    const res = await (
      await backendApi()
    ).prizes.submissionCreate(router.query.slug as string, {
      submissionDescription: JSON.stringify(content),
      submissionHash: submissionHash as string,
      submitterAddress: address,
    });
    console.log({ res }, 'ressss');

    toast.promise(router.push(`/prize/${router.query.slug as string}`), {
      loading: 'Redirecting please wait ',
      success: 'Submission Submitted',
      error: 'Error Submitting Proposal',
    });
  };
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

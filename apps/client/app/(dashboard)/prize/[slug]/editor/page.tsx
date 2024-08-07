'use client';

import type { JSONContent } from '@tiptap/react';
import { Editor as NovalEditor } from 'novel';
import { useState } from 'react';

import { PrizeSubmissionTemplate } from '@/components/Prize/prizepage/defaultcontent';
import { backendApi } from '@/lib/backend';
import { useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function EditorsPage({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<JSONContent | undefined>(
    PrizeSubmissionTemplate,
  );
  const { wallets } = useWallets();
  const router = useRouter();

  const submitToSmartContract = async () => {
    if (!wallets[0]) {
      throw Error('Wallet is undefined');
    }

    const address = wallets[0].address as `0x${string}`;
    console.log(content, 'content'); 

    const res = await (
      await backendApi()
    ).prizes.submissionCreate(params.slug, {
      submissionDescription: JSON.stringify(content),
      submissionHash: '',
      submitterAddress: address,
    });
    console.log({ res }, 'ressss');

   router.push(`/prize/${params.slug}`);
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

export default EditorsPage;

/* eslint-disable @typescript-eslint/no-unused-vars -- I will use them later */
'use client';
import ImageComponent from '@/components/Prize/dropzone';
import usePrizeProposal from '@/components/Prize/hooks/usePrizeProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import useAppUser from '@/context/hooks/useAppUser';
import { Button, Checkbox, NumberInput, SimpleGrid, TextInput } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import router from 'next/router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from 'wagmi';

function Prize() {
  const [address, setAddress] = useState(['']);
  const [title, setTitle] = useState('');
  const [richtext, setRichtext] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [votingTime, setVotingTime] = useState(0);
  const [proposalTime, setProposalTime] = useState(0);
  const { user } = usePrivy();
  const { appUser } = useAppUser();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [images, setImages] = useState<string>();
  const { addProposals, uploadImages } = usePrizeProposal();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);

  const { mutateAsync: addProposalsMutation, isLoading: submittingProposal } =
    useMutation(addProposals);
  // const onAddressChange = (index: number, value: string) => {
  //   setAddress((prev) => {
  //     prev[index] = value;
  //     return [...prev];
  //   });
  // };
  const handleUploadImages = async () => {
    const newImages = await uploadImages(files);

    setImages(newImages);
    return newImages;
  };
  const submit = async () => {
    if (!wallet) {
      throw Error('Wallet is undefined');
    }
    const newImages = await handleUploadImages();
    const finalAddress = address.filter((x) => x);
    await addProposalsMutation({
      admins: [wallet.address, ...finalAddress],
      description: richtext,
      isAutomatic,
      voting_time: votingTime,
      proposer_address: wallet.address,
      priorities: [],
      proficiencies: [],
      submission_time: proposalTime,
      images: newImages ? [newImages] : [],
      title,
    });
    setLoading(false);
    await router.push(`/profile/${appUser?.username}`);
  };

  const handleSubmit = () => {
    console.log(user);
    setLoading(true);
    try {
      console.log(images, 'images');
      toast.promise(submit(), {
        loading: 'Submitting Proposal...',
        success: 'Proposal Submitted',
        error: 'Error Submitting Proposal',
      });
    } catch {
      toast.error('Error Submitting Proposal');
    }
  };

  // const useTemplateForDescription = () => {
  //   setRichtext(PrizeCreationTemplate);
  // };

  // const addAddress = () => {
  //   setAddress((prev: string[]) => {
  //     return [...prev, ''];
  //   });
  // };

  // const removeAddress = (index: number) => {
  //   setAddress((prev) => {
  //     const arr: string[] = JSON.parse(JSON.stringify(prev)) as string[];
  //     arr.splice(index, 1);
  //     return [...arr];
  //   });
  // };
  return (
    <div className="shadow-md max-w-screen-lg p-8 m-6">
      <ImageComponent files={files} setFiles={setFiles} />
      <TextInput
        className="my-2"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <TextEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext />

      <SimpleGrid cols={2} className="my-3">
        <div className="">
          <NumberInput
            placeholder="Proposal Time (in days)"
            label="This is number of days the submission would be valid for "
            value={proposalTime}
            onChange={(e) => {
              setProposalTime(parseInt(e.toString()));
            }}
            allowNegative={false}
          />
          <Checkbox
            checked={isAutomatic}
            onChange={(e) => {
              setIsAutomatic(e.currentTarget.checked);
            }}
            className="my-2 cursor-pointer"
            label="Automatically start campaign when it is accepted by the admin"
          />
        </div>
        <NumberInput
          placeholder="voting Time (in days)"
          label="This is the number of days you want the voting to last "
          allowNegative={false}
          value={votingTime}
          onChange={(e) => {
            setVotingTime(parseInt(e.toString()));
          }}
        />

        {/* {address.map((item, index) => (
          <div className="" key={index}>
            <TextInput
              type="text"
              placeholder="Enter Admin Address"
              className=""
              value={item}
              onChange={(e) => {
                onAddressChange(index, e.target.value);
              }}
            />
            {address.length > 1 && (
              <Button
                color="red"
                className="my-2"
                onClick={() => {
                  removeAddress(index);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        ))} */}
        {/* <ActionIcon variant="filled" color="blue" size="lg" onClick={addAddress}>
          <IconPlus />
        </ActionIcon> */}
      </SimpleGrid>
      <Button
        className="mt-3 "
        fullWidth
        loading={submittingProposal || loading}
        onClick={handleSubmit}
      >
        Request for Approval
      </Button>
    </div>
  );
}

// Prize.getLayout = function getLayout(page: ReactElement) {
//   return <AppShellLayout>{page}</AppShellLayout>;
// };

export default Prize;

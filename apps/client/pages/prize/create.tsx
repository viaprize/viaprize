import {
  Button,
  Checkbox,
  NumberInput,
  SimpleGrid,
  TextInput
} from '@mantine/core';
import type { ReactElement } from 'react';
import { useState } from 'react';

import usePrizeProposal from '@/components/Prize/hooks/usePrizeProposal';
import AppShellLayout from '@/components/layout/appshell';
import useAppUser from '@/context/hooks/useAppUser';
import type { FileWithPath } from '@mantine/dropzone';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import router from 'next/router';
import { toast } from 'sonner';
import { useMutation } from 'wagmi';
import ImageComponent from '../../components/Prize/dropzone';
import { TextEditor } from '../../components/richtexteditor/textEditor';

function Prize() {
  const [address, setAddress] = useState(['']);
  const [title, setTitle] = useState('');
  const [richtext, setRichtext] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [votingTime, setVotingTime] = useState(0);
  const [proposalTime, setProposalTime] = useState(0);
  const { user } = usePrivy();
  const { appUser } = useAppUser()
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [images, setImages] = useState<string>();
  const { addProposals, uploadImages } = usePrizeProposal();
  const { wallet } = usePrivyWagmi();
  const { mutateAsync: addProposalsMutation, isLoading: submittingProposal } =
    useMutation(addProposals);
  const onAddressChange = (index: number, value: string) => {
    setAddress((prev) => {
      prev[index] = value;
      return [...prev];
    });
  };
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
      proposer_address: wallet?.address,
      priorities: [],
      proficiencies: [],
      submission_time: proposalTime,
      images: newImages ? [newImages] : [],
      title,
    });
  };

  const handleSubmit = () => {
    console.log(user);
    try {
      console.log(images, 'images');
      toast.promise(submit(), {
        loading: 'Submitting Proposal',
        success: 'Proposal Submitted',
        error: 'Error Submitting Proposal',
      });
    } catch {
      toast.error('Error Submitting Proposal');
    }
    toast.promise(router.push(`/profile/${appUser?.username as string}`), {
      loading: 'Redirecting Please Wait',
      error: 'Error while redirecting ',
      success: 'Redirected to Profile Page',
    });
  };

  // const useTemplateForDescription = () => {
  //   setRichtext(PrizeCreationTemplate);
  // };

  const addAddress = () => {
    setAddress((prev: string[]) => {
      return [...prev, ''];
    });
  };

  const removeAddress = (index: number) => {
    setAddress((prev) => {
      const arr: string[] = JSON.parse(JSON.stringify(prev)) as string[];
      arr.splice(index, 1);
      return [...arr];
    });
  };
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
            label="Automatically start accepting funds after getting approval from the admin"
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
        loading={submittingProposal}
        onClick={handleSubmit}
      >
        Request for Approval
      </Button>
    </div>
  );
}

Prize.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

export default Prize;

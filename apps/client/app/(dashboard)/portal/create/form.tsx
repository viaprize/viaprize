'use client';


import {
  ActionIcon,
  Button,
  Checkbox,
  CloseButton,
  NumberInput,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { FileWithPath } from '@mantine/dropzone';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { toast } from 'sonner';
import { useMutation } from 'wagmi';
import ImageComponent from '@/components/Prize/dropzone';
import usePortalProposal from '@/components/hooks/usePortalProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import useAppUser from '@/context/hooks/useAppUser';

export default function PortalForm() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [value, setValue] = useState('');
  const [richtext, setRichtext] = useState('');
  const [address, setAddress] = useState(['']);
  const [haveFundingGoal, setHaveFundingGoal] = useState(false);
  const [haveDeadline, setHaveDeadline] = useState(false);
  const [fundingGoal, setFundingGoal] = useState(0);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [allowFundsAboveGoal, setAllowFundsAboveGoal] = useState(false);
  const [images, setImages] = useState<string>();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);

  const { addProposals, uploadImages } = usePortalProposal()

  const { mutateAsync: addProposalsMutation, isLoading: submittingProposal } =
    useMutation(addProposals)

  const { appUser } = useAppUser();
  const router = useRouter()

  const handleUploadImages = async () => {
    const newImages = await uploadImages(files);

    setImages(newImages);
    return newImages;
  };
  
  const onAddressChange = (index: number, funcaddress: string) => {
    setAddress((prev) => {
      prev[index] = funcaddress;
      return [...prev];
    });
  };
  const submit = async () => {
    if (!wallet) {
      throw Error('Wallet is undefined');
    }
    const newImages = await handleUploadImages();
    const finalAddress = address.filter((x) => x);
    await addProposalsMutation({
      allowDonationAboveThreshold: allowFundsAboveGoal,
      deadline: deadline?.toDateString() ?? undefined,
      description: richtext,
      tags: [],
      images: [newImages],
      title: value,
      proposerAddress: wallet.address,
      termsAndCondition: '',
      isMultiSignatureReciever: false,
      treasurers: address,
      fundingGoal: fundingGoal ? fundingGoal : undefined

    });
    setLoading(false);
    await router.push(`/profile/${appUser?.username}`);
  };
  const addAddress = () => {
    setAddress((prev: string[]) => {
      return [...prev, ''];
    });
  };

  const handleSubmit = () => {

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


  const removeAddress = (index: number) => {
    setAddress((prev) => {
      const arr: string[] = JSON.parse(JSON.stringify(prev)) as string[];
      arr.splice(index, 1);
      return [...arr];
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <ImageComponent files={files} setFiles={setFiles} />
      <TextInput
        label="Portal Name"
        placeholder="Waste Management System for the City of Lagos"
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
        radius="md"
        rightSectionPointerEvents="all"
        mt="md"
        className="focus:border-blue-600"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => {
              setValue('');
            }}
            style={{ display: value ? undefined : 'none' }}
          />
        }
      />
      <div className="mt-3">
        <Title order={4}>Tell us about your project... </Title>
        <Text>Aim for 200-500 words</Text>
      </div>
      <TextEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext />
      <div>
        <Title order={4}>Receiving funds</Title>
        <p className="my-0">
          Enter the address where you would like to receive the funds. You can add
          multiple addresses.
        </p>
      </div>
      <SimpleGrid cols={2}>
        {address.map((item, index) => (
          <div className="flex gap-1 justify-start items-center w-full" key={item}>
            <TextInput
              type="text"
              placeholder="Enter Admin Address"
              className="w-full"
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
        ))}
      </SimpleGrid>
      <ActionIcon variant="filled" color="blue" size="lg" onClick={addAddress}>
        <IconPlus />
      </ActionIcon>
      <div className="my-2">
        <Checkbox
          checked={haveFundingGoal}
          onChange={(event) => {
            setHaveFundingGoal(event.currentTarget.checked);
          }}
          label="I have a funding goal"
        />
        {haveFundingGoal ? (
          <div>
            <NumberInput
              label="Funding Goal in ETH"
              min={0}
              placeholder="Enter Funding Goal"
              className="w-full"
              value={fundingGoal}
              onChange={(e) => {
                setFundingGoal(e as number);
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="my-2">
        <Checkbox
          checked={haveDeadline}
          onChange={(event) => {
            setHaveDeadline(event.currentTarget.checked);
          }}
          label="I have a Deadline"
        />
        {haveDeadline ? (
          <DateTimePicker
            label="Deadline"
            value={deadline}
            onChange={setDeadline}
            rightSection={<FaCalendar />}
          />
        ) : null}
      </div>
      {haveFundingGoal && haveDeadline ? (
        <Checkbox
          my="md"
          checked={allowFundsAboveGoal}
          onChange={(event) => {
            setAllowFundsAboveGoal(event.currentTarget.checked);
          }}
          label="Allow funds above goal"
        />
      ) : null}
      <Button color="blue" variant="light" radius="md" loading={submittingProposal || loading}
        onClick={handleSubmit}>
        Create Portal
      </Button>
    </div>
  );
}

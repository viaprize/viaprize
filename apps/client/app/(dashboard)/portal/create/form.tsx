'use client';

import ImageComponent from '@/components/Prize/dropzone';
import usePortalProposal from '@/components/hooks/usePortalProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import useAppUser from '@/context/hooks/useAppUser';
import { ConvertUSD } from '@/lib/types';
import { chain } from '@/lib/wagmi';
import {
  Button,
  Checkbox,
  CloseButton,
  Group,
  NumberInput,
  Radio,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { FileWithPath } from '@mantine/dropzone';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useMutation } from 'wagmi';

export default function PortalForm() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState('');
  const [richtext, setRichtext] = useState('');
  const [address, setAddress] = useState('');
  const [fundingGoal, setFundingGoal] = useState<number>();
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [allowFundsAboveGoal, setAllowFundsAboveGoal] = useState(false);
  const [images, setImages] = useState<string>();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState('pass-through');

  const { addProposals, uploadImages } = usePortalProposal();

  const { mutateAsync: addProposalsMutation, isLoading: submittingProposal } =
    useMutation(addProposals);
  const { data: crytoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    const final = await (
      await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`)
    ).json();
    return Object.keys(final).length === 0
      ? {
          [chain.name.toLowerCase()]: {
            usd: 2357.89,
          },
        }
      : final;
  });
  console.log(crytoToUsd, 'crytoToUsd');
  function convertUSDToCrypto(usd: number) {
    if (!crytoToUsd) {
      toast.error('Error converting USD to Crypto');
      return 0;
    }
    const cryto_to_usd_value = crytoToUsd['ethereum'].usd;
    const eth_to_cryto = usd / cryto_to_usd_value;
    return parseFloat(eth_to_cryto.toFixed(4));
  }

  const { appUser } = useAppUser();
  const router = useRouter();

  const handleUploadImages = async () => {
    const newImages = await uploadImages(files);

    setImages(newImages);
    return newImages;
  };

  // const onAddressChange = (index: number, funcaddress: string) => {
  //   setAddress((prev) => {
  //     prev[index] = funcaddress;
  //     return [...prev];
  //   });
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
  const generateTags = () => {
    const tags = [];
    const sendNow = portalType === 'pass-through';
    if (!sendNow) {
      tags.push('All-or-Nothing');
      tags.push('Refundable');
    }
    if (sendNow) {
      tags.push('Pass-through');
    }
    if (deadline) {
      tags.push('Deadline');
    }
    if (fundingGoal) {
      tags.push('Funding Goal');
    }
    return tags;
  };
  const submit = async () => {
    if (!wallet) {
      throw Error('Wallet is undefined');
    }
    const finalFundingGoal = fundingGoal ? convertUSDToCrypto(fundingGoal) : undefined;

    const newImages = await handleUploadImages();
    await addProposalsMutation({
      allowDonationAboveThreshold: allowFundsAboveGoal,
      deadline: deadline?.toISOString() ?? undefined,
      description: richtext,
      tags: generateTags(),
      images: [newImages] as string[],
      title: title,
      proposerAddress: wallet.address,
      termsAndCondition: 'test',
      isMultiSignatureReciever: false,
      treasurers: [address],
      fundingGoal: finalFundingGoal,
      sendImmediately: portalType === 'pass-through',
    });
    router.push(`/profile/${appUser?.username}`);
    setLoading(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    try {
      // console.log(images, 'images');
      toast.promise(submit(), {
        loading: 'Submitting Proposal...',
        success: 'Proposal Submitted',
        error: 'Error Submitting Proposal',
      });
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /* eslint-disable */
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ImageComponent files={files} setfiles={setFiles} />
      <TextInput
        label="Portal Name"
        placeholder="Waste Management System for the City of Lagos"
        value={title}
        onChange={(event) => {
          setTitle(event.currentTarget.value);
        }}
        radius="md"
        rightSectionPointerEvents="all"
        mt="md"
        required
        className="focus:border-blue-600"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => {
              setTitle('');
            }}
            style={{ display: title ? undefined : 'none' }}
          />
        }
      />
      <div className="mt-3">
        <Title order={4}>Required: Tell us about your project... </Title>
        <Text>Aim for 200-500 words</Text>
      </div>
      <TextEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext />
      <div>
        <Title order={4}>Receiving funds</Title>
        <p className="my-0">
          Enter the wallet address where you would like to receive the funds
        </p>
      </div>
      {/* <SimpleGrid cols={2}>
        {address.map((item, index) => (
          <div className="flex gap-1 justify-start items-center w-full" key={item}> */}
      <TextInput
        type="text"
        label="Treasurer wallet address"
        placeholder="Must start with 0x..."
        className="w-full"
        onChange={(e) => {
          setAddress(e.target.value);
        }}
        required
      />
      {/* {address.length > 1 && (
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
      </SimpleGrid> */}
      {/* <ActionIcon variant="filled" color="blue" size="lg" onClick={addAddress}>
        <IconPlus />
      </ActionIcon> */}
      <Radio.Group
        name="favoriteFramework"
        label="Select your portal type"
        withAsterisk
        onChange={setPortalType}
        value={portalType}
      >
        <Group mt="xs">
          <Tooltip
            label="Send all the contributions at once automatically if a funding goal is met and refund 
            contributors if the funding goal is not met by the deadline "
            refProp="rootRef"
          >
            <Radio value="all-or-nothing" label="All-or-nothing" />
          </Tooltip>
          <Tooltip
            label="Immediately forward contributions to the recipient and end campaigns manually"
            refProp="rootRef"
          >
            <Radio value="pass-through" label="Pass-through" />
          </Tooltip>
        </Group>
      </Radio.Group>
      <div className="my-2">
        {portalType === 'all-or-nothing' ? (
          <div>
            <div className="flex gap-1 items-center justify-start mt-3 mb-1">
              <Text>
                Funding Goal in {`( ${convertUSDToCrypto(fundingGoal ?? 0)}`}{' '}
                {chain.nativeCurrency.symbol} {')'}
              </Text>
            </div>
            <NumberInput
              required
              min={0}
              label="Funding Goal"
              leftSection="$"
              placeholder="Enter Funding Goal in USD"
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
        {portalType === 'all-or-nothing' ? (
          <DateTimePicker
            withAsterisk
            minDate={new Date()}
            required
            label="Deadline"
            value={deadline}
            onChange={setDeadline}
            rightSection={<FaCalendar />}
          />
        ) : null}
      </div>
      {portalType === 'all-or-nothing' ? (
        <Checkbox
          my="md"
          checked={allowFundsAboveGoal}
          onChange={(event) => {
            setAllowFundsAboveGoal(event.currentTarget.checked);
          }}
          label="Allow funds above goal"
        />
      ) : null}
      <Button
        color="primary"
        radius="md"
        loading={submittingProposal || loading}
        onClick={handleSubmit}
        disabled={
          !isAddress(address) ||
          !title ||
          !richtext ||
          !address ||
          !files.length ||
          (portalType === 'all-or-nothing' && (!fundingGoal || !deadline))
        }
      >
        Create Portal
      </Button>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unsafe-argument -- wont need it*/
/* eslint-disable @typescript-eslint/no-unsafe-return -- wont need it */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- didnt need it */
/* eslint-disable @typescript-eslint/no-explicit-any -- it was important */
'use client';

import ImageComponent from '@/components/Prize/dropzone';
import usePortalProposal from '@/components/hooks/usePortalProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import useAppUser from '@/context/hooks/useAppUser';
import type { PortalProposals } from '@/lib/api';
import type { ConvertUSD } from '@/lib/types';
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

interface PortalProposalForm extends Partial<PortalProposals> {
  id: string;
}

export default function PortalProposalForm({
  id,
  title: proposalTitle,
  description,
  deadline: proposalDeadline,
  fundingGoal: proposalFundingGoal,
  allowDonationAboveThreshold: proposalAllowDonationAboveThreshold,
  images: proposalImages,
  treasurers: proposalTreasurers,
  user: proposalUser,
  sendImmediately: proposalSendImmediately,
}: PortalProposalForm) {
  const { updateProposal, uploadImages } = usePortalProposal();

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState(proposalTitle);
  const [richtext, setRichtext] = useState(description);
  const [address, setAddress] = useState(proposalTreasurers?.[0] ?? '');
  const [deadline, setDeadline] = useState<Date | null>(
    proposalDeadline ? new Date(proposalDeadline) : null,
  );
  const [allowFundsAboveGoal, setAllowFundsAboveGoal] = useState(
    proposalAllowDonationAboveThreshold,
  );
  const [images, setImages] = useState<string>();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState(
    proposalSendImmediately ? 'pass-through' : 'all-or-nothing',
  );
  const [fundingGoal, setFundingGoal] = useState<number | undefined>(proposalFundingGoal);
  const [image,setImage] = useState(proposalImages?.[0]);
  console.log(image, 'image')

  const { mutateAsync: updateProposalsMutation, isLoading: updatatingProposal } =
    useMutation(updateProposal);

  const { data: crytoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    const final = await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
      )
    ).json();
    return Object.keys(final).length === 0
      ? {
          [chain.name.toLowerCase()]: {
            usd: 2357.89,
          },
        }
      : final;
  });

  function convertUSDToCrypto(usd: number) {
    if (!crytoToUsd) {
      toast.error('Error converting USD to Crypto');
      return 0;
    }

    const cryptoToUsd = crytoToUsd.ethereum.usd;
    const ethToCrypto = usd / cryptoToUsd;
    return parseFloat(ethToCrypto.toFixed(4));
  }

  const { appUser } = useAppUser();
  const router = useRouter();

  const handleUploadImages = async () => {
    const newImages = await uploadImages(files);

    setImages(newImages);
    return newImages;
  };

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
    console.log(deadline?.toISOString(), 'deadline');
    await updateProposalsMutation({
      id,
      dto: {
        allowDonationAboveThreshold: allowFundsAboveGoal,
        deadline: deadline?.toISOString() ?? undefined,
        description: richtext,
        tags: generateTags(),
        images: [newImages],
        title,
        proposerAddress: wallet.address,
        termsAndCondition: 'test',
        isMultiSignatureReciever: false,
        treasurers: [address],
        fundingGoal: finalFundingGoal,
        sendImmediately: portalType === 'pass-through',
        platformFeePercentage: 5,
      },
    });
    router.push(`/profile/${appUser?.username}`);
    setLoading(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    try {
      // console.log(images, 'images');
      toast.promise(submit(), {
        loading: 'Updating Proposal...',
        success: 'Proposal Updated Successfully',
        error: 'Error Updating Proposal',
      });
    } catch (e: any) {
      /* eslint-disable -- it should work */
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!appUser || appUser.id !== proposalUser?.id) {
    return <div className="h-full w-full grid place-content-center">Not authorized</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ImageComponent files={files} setfiles={setFiles} image={image} />
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
        value={address}
        required
      />
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
        loading={updatatingProposal || loading}
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
        Update Portal
      </Button>
    </div>
  );
}

'use client';

import ImageComponent from '@/components/Prize/dropzone';
import useAppUser from '@/components/hooks/useAppUser';
import usePortalProposal from '@/components/hooks/usePortalProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import { platformFeePercentage } from '@/config';
import { campaignsTags } from '@/lib/constants';
import type { ConvertUSD } from '@/lib/types';
import { chain } from '@/lib/wagmi';
import {
  Button,
  Checkbox,
  CloseButton,
  Group,
  MultiSelect,
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
import { useMemo, useState } from 'react';
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
  const [fundingGoal, setFundingGoal] = useState<number>(0);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [allowFundsAboveGoal, setAllowFundsAboveGoal] = useState(false);
  const [images, setImages] = useState<string>();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState('pass-through');
  const [categories, setCategories] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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
            usd: 0,
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
    const cryto_to_usd_value = crytoToUsd.ethereum.usd;
    const eth_to_cryto = usd / cryto_to_usd_value;
    return parseFloat(eth_to_cryto.toFixed(4));
  }

  const { appUser } = useAppUser();
  const router = useRouter();

  const handleUploadImages = async () => {
    setUploadingImages(true);
    const newImages = await uploadImages(files);
    setUploadingImages(false);
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
    const tags: string[] = [];
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
    setCategories((prev) => {
      return [...prev, ...tags];
    });
  };
  const submit = async () => {
    if (!wallet) {
      throw Error('Wallet is undefined');
    }
    generateTags();
    const newImages = await handleUploadImages();
    await addProposalsMutation({
      allowDonationAboveThreshold: allowFundsAboveGoal,
      deadline: deadline?.toISOString() ?? undefined,
      description: richtext,
      tags: categories,
      images: [newImages] as string[],
      title,
      proposerAddress: wallet.address,
      termsAndCondition: 'test',
      isMultiSignatureReciever: false,
      treasurers: [address],
      fundingGoal: fundingGoal === 0 ? undefined : finalFundingGoalEth.toString(),
      sendImmediately: portalType === 'pass-through',
    });
    router.push(`/profile/${appUser?.username}`);
    setLoading(false);
  };

  const finalFundingGoalWithPlatformFees = useMemo(() => {
    if (!fundingGoal) {
      return 0;
    }
    const ethValue = convertUSDToCrypto(fundingGoal);
    return parseFloat(
      (ethValue + ethValue * (platformFeePercentage / 100)).toPrecision(4),
    );
  }, [fundingGoal]);

  const finalFundingGoalEth = useMemo(() => {
    if (!fundingGoal) {
      return 0;
    }
    const ethValue = convertUSDToCrypto(fundingGoal);
    return ethValue;
  }, [fundingGoal]);

  const finalFundingGoalUsd = useMemo<number>(() => {
    if (!fundingGoal) {
      return 0;
    }

    console.log({ fundingGoal });
    const fundingGoalPercentage =
      parseFloat(fundingGoal.toString()) * (platformFeePercentage / 100);
    console.log({ fundingGoalPercentage });
    return parseFloat(fundingGoal.toString()) + fundingGoalPercentage;
  }, [fundingGoal]);

  console.log({ finalFundingGoalUsd });

  const handleSubmit = () => {
    setLoading(true);
    try {
      // console.log(images, 'images');
      toast.promise(submit(), {
        loading: 'Submitting proposal...',
        success: 'Proposal submitted',
        error: 'Error submitting proposal',
      });
    } catch (e: any) {
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
      {/* <NovelEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext /> */}
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
      <MultiSelect
        label="Pick Categories"
        placeholder="Pick value"
        data={campaignsTags}
        value={categories}
        onChange={setCategories}
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
        {portalType === 'all-or-nothing' && crytoToUsd ? (
          <div>
            <div className="flex gap-1 items-center justify-start mt-3 mb-1">
              <Text>
                Funding goal in total (+ platform fee of {platformFeePercentage}% ){' '}
                {`$${finalFundingGoalUsd}`} ({`${finalFundingGoalWithPlatformFees}`}{' '}
                {chain.nativeCurrency.symbol} {')'}
              </Text>
            </div>
            <NumberInput
              required
              min={0}
              description={`You will get in total $${fundingGoal} and Platform would get $${
                fundingGoal * (platformFeePercentage / 100)
              }`}
              label="Funding Goal"
              leftSection="$"
              placeholder="Enter Funding Goal in USD"
              className="w-full"
              allowLeadingZeros={false}
              allowNegative={false}
              value={fundingGoal}
              onChange={(e) => {
                if (parseInt(e.toString()) === 0) {
                  console.log('hiii');
                  setFundingGoal(0);
                  return;
                }
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
        loading={submittingProposal || loading || uploadingImages}
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

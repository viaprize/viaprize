'use client';

import ImageComponent from '@/components/Prize/dropzone';
import ShouldLogin from '@/components/custom/should-login';
import useAppUser from '@/components/hooks/useAppUser';
import usePrizeProposal from '@/components/hooks/usePrizeProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import { addDaysToDate } from '@/lib/utils';
import { Button, Card, SimpleGrid, TextInput, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { FileWithPath } from '@mantine/dropzone';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from 'wagmi';

function Prize() {
  const [judges, setJudges] = useState<string[]>([]);
  const [showJudges, setShowJudges] = useState(false);
  const [title, setTitle] = useState('');
  const [richtext, setRichtext] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [votingTime, setVotingTime] = useState(0);
  const [votingDateTime, setVotingDateTime] = useState<Date | null>(
    addDaysToDate(new Date(), 6),
  );
  const [proposalTime, setProposalTime] = useState(0);
  const { user } = usePrivy();
  const { appUser } = useAppUser();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [images, setImages] = useState<string>();
  const { addProposals, uploadImages } = usePrizeProposal();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [startVotingDate, setStartVotingDate] = useState<Date | null>(
    addDaysToDate(new Date(), 3),
  );

  const [startSubmisionDate, setStartSubmissionDate] = useState<Date | null>(new Date());

  const { mutateAsync: addProposalsMutation, isLoading: submittingProposal } =
    useMutation(addProposals);
  const onJudgesChange = (index: number, value: string) => {
    setJudges((prev) => {
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
    if (!startSubmisionDate) {
      throw Error('Start Submission Date should be given');
    }
    if (!startVotingDate) {
      throw Error('Start voting date');
    }
    const newImages = await handleUploadImages();
    // const finalAddress = address.filter((x) => x);
    await addProposalsMutation({
      admins: [wallet.address],
      description: richtext,
      isAutomatic,
      voting_time: votingTime,
      proposer_address: wallet.address,
      priorities: [],
      proficiencies: [],
      submission_time: proposalTime,
      startSubmissionDate: startSubmisionDate.toISOString(),
      startVotingDate: startVotingDate.toISOString(),
      images: newImages ? [newImages] : [],
      judges: showJudges ? judges : [],
      title,
    });
    setLoading(false);
    router.push(`/profile/${appUser?.username}`);
  };

  const handleSubmit = () => {
    console.log(user);
    setLoading(true);
    try {
      // console.log(images, 'images');
      toast.promise(submit(), {
        loading: 'Submitting Proposal...',
        success: 'Proposal Submitted',
        error: (err) => {
          console.log(err);
          return `Failed to submit proposal ${err}`;
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      /* eslint-disable */
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addJudges = () => {
    setJudges((prev: string[]) => {
      return [...prev, ''];
    });
  };

  const removeJudges = (index: number) => {
    setJudges((prev) => {
      const arr: string[] = JSON.parse(JSON.stringify(prev)) as string[];
      arr.splice(index, 1);
      return [...arr];
    });
  };
  if (!appUser) {
    return <ShouldLogin text="Please login to create a prize" />;
  }

  return (
    <Card shadow="md" withBorder className="w-full p-8 m-6">
      <Title order={1} className="my-2">
        Create a Prize
      </Title>
      <ImageComponent files={files} setfiles={setFiles} />

      <TextInput
        className="my-2"
        placeholder="Waster Management System"
        label="Enter the title of your proposal"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <TextEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext />

      <SimpleGrid cols={2} className="my-3">
        <div className="">
          <DateTimePicker
            label="Pick date and time of starting submission time"
            placeholder="Make sure its above the submission time and date"
            value={startSubmisionDate ?? new Date()}
            onChange={(da) => {
              setStartSubmissionDate(da);
            }}
          />
          {/* <NumberInput
            placeholder="Submission Time (in minutes)"
            label={
              proposalTime && startSubmisionDate
                ? `Submission will end at ${addMinutes(startSubmisionDate ?? new Date(), proposalTime)}`
                : `This is the number of minutes you want the submission to last `
            }
            value={proposalTime}
            onChange={(e) => {
              setProposalTime(parseInt(e.toString()));
            }}
            allowNegative={false}
          /> */}
          <DateTimePicker
            label="Pick End of Juding time and start of voting time"
            placeholder="Make sure its above the voting time and date"
            minDate={addDaysToDate(new Date(), 4)}
            value={votingDateTime ?? addDaysToDate(new Date(), 6)}
            onChange={(da) => {
              setVotingDateTime(da);
              if (da && startVotingDate) {
                setProposalTime((da.getTime() - startVotingDate.getTime()) / 1000 / 60);
              }
            }}
          />
        </div>
        <div className="">
          <DateTimePicker
            label="Pick date and time of starting juding time and end of submission time"
            placeholder="Make sure its above the voting time and date"
            minDate={addDaysToDate(new Date(), 3)}
            value={startVotingDate ?? addDaysToDate(new Date(), 3)}
            onChange={(da) => {
              setStartVotingDate(da);
              if (da && startSubmisionDate) {
                setProposalTime(
                  (da.getTime() - startSubmisionDate.getTime()) / 1000 / 60,
                );
              }
            }}
          />

          {/* <NumberInput
            placeholder="Voting Time (in minutes)"
            label={
              votingTime && startVotingDate
                ? `Voting will end at  ${addMinutes(startVotingDate, votingTime)}`
                : `This is the number of minutes you want the voting to last `
            }
            allowNegative={false}
            value={votingTime}
            onChange={(e) => {
              setVotingTime(parseInt(e.toString()));
            }}
          /> */}
        </div>
      </SimpleGrid>
      <Button
        className="mt-3 "
        fullWidth
        color="primary"
        loading={submittingProposal || loading}
        onClick={handleSubmit}
      >
        Request for Approval
      </Button>
    </Card>
  );
}
export default Prize;

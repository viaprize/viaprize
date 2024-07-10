'use client';

import ImageComponent from '@/components/Prize/dropzone';
import ShouldLogin from '@/components/custom/should-login';
import useAppUser from '@/components/hooks/useAppUser';
import usePrizeProposal from '@/components/hooks/usePrizeProposal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import { addDaysToDate } from '@/lib/utils';
import {
  Badge,
  Button,
  Card,
  Loader,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { FileWithPath } from '@mantine/dropzone';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import { addDays, differenceInMinutes } from 'date-fns';
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

  const [votingDateTime, setVotingDateTime] = useState<Date>(
    addDaysToDate(new Date(), 6),
  );

  const { user } = usePrivy();
  const { appUser } = useAppUser();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [images, setImages] = useState<string>();
  const { addProposals, uploadImages } = usePrizeProposal();
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);

  const [startVotingDate, setStartVotingDate] = useState<Date>(
    addDaysToDate(new Date(), 3),
  );

  const [startSubmisionDate, setStartSubmissionDate] = useState<Date>(new Date());

  const [proposalTime, setProposalTime] = useState(
    parseInt(differenceInMinutes(startVotingDate, startSubmisionDate).toString()),
  );

  const [votingTime, setVotingTime] = useState(
    parseInt(differenceInMinutes(votingDateTime, startVotingDate).toString()),
  );

  console.log({ proposalTime, startSubmisionDate, startVotingDate, votingTime });

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
    console.log({
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

      judges: showJudges ? judges : [],
      title,
    });
    const newImages = await handleUploadImages();
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

    setModalOpened(true);
    setTimeout(() => {
      setModalOpened(false);
      router.push(`/profile/${appUser?.username}`);
    }, 6000);
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
      <Badge
        color="yellow"
        variant="light"
        radius="sm"
        mb="sm"
        p="sm"
        leftSection={<IconAlertTriangleFilled />}
      >
        Voting begin automatically when submission ends
      </Badge>

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
      <SimpleGrid cols={{ base: 1, sm: 1, lg: 3 }} className="my-3">
        <DateTimePicker
          label="Submissions open"
          placeholder="Make sure its above the submission time and date"
          minDate={new Date()}
          value={startSubmisionDate}
          onChange={(da) => {
            if (!da) return;
            setStartSubmissionDate(da);
          }}
        />
        {/* <NumberInput
            placeholder="Submission Time (in minutes)"
            label={
              proposalTime && startSubmisionDate
                ? `Submission will end at ${addMinutes(startSubmisionDate ?? new Date(), proposalTime)}`
                : `This is the number of minutes you want the submission to last `a
            }
            value={proposalTime}
            onChange={(e) => {
              setProposalTime(parseInt(e.toString()));
            }}
            allowNegative={false}
          /> */}
        <DateTimePicker
          label="Submissions end and judging begins"
          placeholder="Make sure its above the voting time and date"
          minDate={addDays(new Date(), 3)}
          value={startVotingDate}
          onChange={(da) => {
            if (!da) return;
            setStartVotingDate(da);
            if (da && startSubmisionDate) {
              setProposalTime(
                parseInt(differenceInMinutes(da, startSubmisionDate).toString()),
              );
              console.log(proposalTime, 'proposal time');
            }
          }}
        />

        <DateTimePicker
          label="End judging"
          placeholder="Make sure its above the voting time and date"
          minDate={addDays(new Date(), 4)}
          value={votingDateTime}
          onChange={(da) => {
            if (!da) return;
            setVotingDateTime(da);
            console.log('sljdflsjdlsdjlfsssssjd');
            console.log(da.getMinutes(), 'minutes');
            if (da && startVotingDate) {
              setVotingTime(
                parseInt(differenceInMinutes(da, startVotingDate).toString()),
              );
            }
          }}
          onDateChange={(da) => {
            console.log('sdklflksjkldjl');
            console.log({ da });
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
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        withCloseButton={false}
        centered
        size="md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#40d940"
          className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check w-full flex justify-center h-16"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
        </svg>
        <Text className="my-3" fw="bold">
          Proposal submitted successfully! Admins will review and let you know if it is
          approved shortly.
        </Text>

        <Text className="w-full flex justify-center">
          Redirecting to your profile <Loader color="blue" size="sm" className="ml-2" />
        </Text>

        {/* <Link href={`/profile/${appUser?.username}`}>
        <Button
          className="w-full flex justify-center"
          
        >
          Go to Profile
        </Button>
</Link> */}
      </Modal>
    </Card>
  );
}
export default Prize;

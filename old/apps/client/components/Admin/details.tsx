import { User } from '@/lib/api';
import { Badge, Card, Flex, Group, Image, Stack } from '@mantine/core';
import PrizeFunderCard from '../Prize/prizepage/prizeFunderCard';
import { TextEditor } from '../richtexteditor/textEditor';

// Utility function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toString();
};

// Utility function to calculate remaining time
const calculateRemainingTime = (startDateString: string, durationMinutes: number) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const now = new Date();

  const elapsedTime = now.getTime() - startDate.getTime();
  const remainingTime = endDate.getTime() - now.getTime();

  let remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
  let remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

  if (elapsedTime < 0) {
    remainingHours = Math.floor(durationMinutes / 60);
    remainingMinutes = durationMinutes % 60;
  }

  return {
    endDate: endDate.toString(),
    remainingHours,
    remainingMinutes,
  };
};

export default function ViewDetails({
  admins,
  user,
  description,
  images,
  submission,
  title,
  voting,
  startSubmissionDate,
  startVotingDate,
}: {
  images: string[];
  title: string;
  description: string;
  admins: string[];
  voting: number;
  submission: number;
  startVotingDate: string;
  startSubmissionDate: string;
  user: User;
}) {
  const submissionTime = calculateRemainingTime(startSubmissionDate, submission);
  const votingTime = calculateRemainingTime(startVotingDate, voting);

  return (
    <Flex direction="column" gap="sm" my="xl">
      {images.length > 0
        ? images.map((image) => (
            <Image src={image} height={160} alt="Image" key={image} />
          ))
        : null}
      <div>
        <h2>{title}</h2>
        <TextEditor disabled richtext={description} />
      </div>
      <PrizeFunderCard
        username={user.username}
        name={user.name}
        email={user.email}
        avatar={user.avatar}
      />
      <div>
        Admin wallets
        {admins.map((admin, index) => (
          <Card shadow="sm" padding="lg" radius="md" key={admin} withBorder mt="sm">
            {index + 1}. {admin}
          </Card>
        ))}
        <Stack my="sm">
          <Badge color="cyan" p="sm">
            Submission starting date : {formatDate(startSubmissionDate)}
          </Badge>
          <Badge color="cyan" p="sm">
            Submission ending date: {submissionTime.endDate}
          </Badge>
          <Badge color="cyan" p="sm">
            Time allotted for submission: {submissionTime.remainingHours} hours{' '}
            {submissionTime.remainingMinutes} minutes
          </Badge>
          <Badge color="cyan" p="sm">
            Voting starting date: {formatDate(startVotingDate)}
          </Badge>
          <Badge color="cyan" p="sm">
            Voting ending date: {votingTime.endDate}
          </Badge>
          <Badge color="cyan" p="sm">
            Time allotted for voting: {votingTime.remainingHours} hours{' '}
            {votingTime.remainingMinutes} minutes
          </Badge>
        </Stack>
      </div>
    </Flex>
  );
}

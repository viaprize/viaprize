import ExploreCard from '@/components/ExplorePrize/explorePrize';
import { Api } from '@/lib/api';
import { formatEther } from 'viem';
import { Text } from '@mantine/core';
export default async function FetchPrizes() {
  const prizes = (
    await new Api().prizes.prizesList({
      limit: 10,
      page: 1,
    })
  ).data.data;

  const calculateRemainingTime = (submissionDate: string) => {
    const remainingTime = new Date(submissionDate).getTime() - Date.now();

    if (remainingTime <= 0) {
      return <Text c="red">Time is up!</Text>;
    } else if (remainingTime < 60 * 60 * 1000) {
      // Less than 1 hour in milliseconds
      const minutes = Math.floor(remainingTime / (60 * 1000));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
    } else if (remainingTime < 24 * 60 * 60 * 1000) {
      // Less than 1 day in milliseconds
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
    }
    const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
    return `${days} day${days !== 1 ? 's' : ''} remaining`;
  };

  const calculateDeadline = (startSubmissionTime: string, submissionDays: number) => {
    const start = new Date(startSubmissionTime);
    console.log(start, 'start');
    const submissionDate = new Date(startSubmissionTime);
    submissionDate.setDate(start.getDate() + submissionDays);
    console.log(submissionDate, 'submissionDate');
    const remainingTime = calculateRemainingTime(submissionDate.toISOString());
    const dateString = submissionDate.toISOString().split('T')[0];
    return { remainingTime, dateString };
  };

  return (
    <>
      {prizes.map((prize) => {
        const deadlineString = calculateDeadline(prize.created_at, prize.submissionTime);
        return (
          <ExploreCard
            description={prize.description}
            imageUrl={prize.images[0]}
            deadlinetimereamining={deadlineString.remainingTime}
            deadline={deadlineString.dateString}
            money={formatEther(BigInt(prize.balance))}
            profileName={prize.user ? prize.user.name : ''}
            title={prize.title}
            key={prize.id}
            id={prize.id}
            skills={prize.priorities || prize.proficiencies}
          />
        );
      })}
    </>
  );
}

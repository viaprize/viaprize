'use client';
import { Button } from '@viaprize/ui/button';
import { Separator } from '@viaprize/ui/separator';
import { useState } from 'react';
import VotingCard from './voting-card';

// Define the type for a user
type User = {
  id: number;
  name: string;
  avatar: string;
  submitted: string;
  votes: number | string; // Allow string for easier handling with inputs
};

interface VotingSectionProps {
  users: User[];
}

export default function VotingSection({ users }: VotingSectionProps) {
  const [userVotes, setUserVotes] = useState<User[]>(users); // Initialize state with users prop
  const [totalVotesLeft, setTotalVotesLeft] = useState<number>(100); // Total votes left

  // Function to handle vote input changes
  const handleVoteChange = (id: number, newVotes: number | string) => {
    const updatedUsers = userVotes.map((user) =>
      user.id === id ? { ...user, votes: newVotes } : user,
    );
    setUserVotes(updatedUsers);
  };

  // Function to handle the final vote submission
  const handleFinalVoteSubmit = () => {
    let totalVotes = 0;
    userVotes.forEach(
      (user) => (totalVotes += Number.parseInt(user.votes as string) || 0),
    );

    // Check if votes are within allowed total votes
    if (totalVotes <= 100) {
      console.log('Submitted votes for all users:', userVotes);
      setTotalVotesLeft(100 - totalVotes); // Update the total votes left
    } else {
      alert('Total votes exceed the allowed limit of 100.');
    }
  };

  return (
    <div className="p-3">
      <div className="w-full flex items-center justify-between text-xl">
        <div>Voting ({userVotes.length})</div>
        <div>Total voting Points left: {totalVotesLeft}</div>
      </div>
      <Separator className="my-2" />

      {/* Map over users and render VotingCard for each */}
      {userVotes.map((user) => (
        <VotingCard key={user.id} user={user} onVoteChange={handleVoteChange} />
      ))}

      {/* Final vote submission button */}
      <Button className="mt-3 w-full" onClick={handleFinalVoteSubmit}>
        Submit All Votes
      </Button>
    </div>
  );
}

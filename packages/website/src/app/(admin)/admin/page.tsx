import { auth } from "@/server/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Button } from "@viaprize/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@viaprize/ui/card";
import { Rocket } from "lucide-react";
import Image from "next/image";

interface Proposal {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  submissionStartDate: string;
  submissionDuration: number;
  votingStartDate: string;
  votingDuration: number;
  proposerAddress: string;
  authorUsername: string;
}

function ProposalCard({
  proposal,
  onDeploy,
}: { proposal?: Proposal; onDeploy?: (id: string) => void } = {}) {
  if (!proposal) {
    return (
      <Card className="w-full max-w-2xl p-6">
        <p>No proposal data available.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://avatar.vercel.sh/${proposal.authorUsername}`}
              alt={`${proposal.authorUsername}'s avatar`}
            />
            <AvatarFallback>
              {proposal.authorUsername.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{proposal.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {proposal.authorUsername}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposal.imageUrl && (
          <div
            className="relative w-full"
            style={{ height: "0", paddingBottom: "30%" }}
          >
            <Image
              src={proposal.imageUrl}
              alt={proposal.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-sm line-clamp-3">{proposal.description}</p>
        <Button variant="outline" className="w-full">
          Read More
        </Button>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Submission Duration:</p>
            <p>{proposal.submissionDuration} days</p>
          </div>
          <div>
            <p className="font-semibold">Voting Start Date:</p>
            <p>{new Date(proposal.votingStartDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Voting Duration:</p>
            <p>{proposal.votingDuration} days</p>
          </div>
          <div>
            <p className="font-semibold">Proposer Address:</p>
            <p className="truncate">{proposal.proposerAddress}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Rocket className="mr-2 h-4 w-4" /> Deploy
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function DashBoardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    return "You need to be logged in to access this page";
  }
  if (!session.user.isAdmin) {
    return "You need to be an admin to access this page";
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProposalCard
          key={"hi"}
          proposal={{
            authorUsername: "johndoe",
            description: "descript",
            id: "1",
            imageUrl: "https://picsum.photos/200/300",
            proposerAddress: "0x123",
            submissionDuration: 10,
            submissionStartDate: "2021-10-10",
            title: "title",
            votingDuration: 10,
            votingStartDate: "2021-10-10",
          }}
        />
      </div>
    </div>
  );
}

"use client";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/trpc/react";
import { Button } from "@viaprize/ui/button";
import React from "react";
export default function EndVotingButton({
  prizeContractAddress,
}: {
  prizeContractAddress: string;
}) {
  const { session } = useAuth();
  if (!session) return null;
  if (!session.user.isAdmin) return null;
  const { mutateAsync: endVoting, isPending } =
    api.prizes.endVoting.useMutation();

  return (
    <Button
      onClick={async () =>
        await endVoting({
          contractAddress: prizeContractAddress,
        })
      }
      disabled={isPending}
    >
      End Voting
    </Button>
  );
}

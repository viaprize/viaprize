"use client";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/trpc/react";
import { Button } from "@viaprize/ui/button";
import React from "react";
export default function StartSubmissionButton({
  prizeContractAddress,
}: {
  prizeContractAddress: string;
}) {
  const { session } = useAuth();
  if (!session) return null;
  if (!session.user.isAdmin) return null;
  const { mutateAsync: startSubmission, isPending } =
    api.prizes.startSubmission.useMutation();

  return (
    <Button
      onClick={async () =>
        await startSubmission({
          contractAddress: prizeContractAddress,
        })
      }
      disabled={isPending}
    >
      Start Submission
    </Button>
  );
}

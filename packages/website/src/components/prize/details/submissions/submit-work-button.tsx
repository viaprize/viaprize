"use client";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/trpc/react";
import { IconPresentation } from "@tabler/icons-react";
import { Badge } from "@viaprize/ui/badge";
import { Button } from "@viaprize/ui/button";
import { LoaderIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SubmitWorkButton({ prizeId }: { prizeId: string }) {
  const mutation = api.prizes.addSubmission.useMutation();
  const { session } = useAuth();
  if (!session?.user) {
    return <Badge>Please sign in to submit your work</Badge>;
  }
  if (!session.user.username) {
    return <Badge>Please complete your profile to submit your work</Badge>;
  }
  const handleSubmit = async () => {
    if (!session) {
      throw new Error("Login required");
    }

    if (!session.user.walletAddress) {
      throw new Error("Wallet address is not set");
    }

    await mutation.mutateAsync({
      prizeId: prizeId,
      contestant: session.user.walletAddress,
      submissionText: "Submission text",
    });
  };
  return (
    <>
      <Button size="sm" onClick={handleSubmit}>
        <IconPresentation className="mr-2" size={20} />
        {mutation.isPending ? (
          <>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Submit your work"
        )}
      </Button>
    </>
  );
}

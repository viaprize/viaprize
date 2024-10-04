"use client";
import { api } from "@/trpc/react";
import { Button } from "@viaprize/ui/button";
export default function JoinContestantButton({
  prizeId,
  slug,
}: {
  prizeId: string;
  slug: string;
}) {
  const utils = api.useUtils();
  const addContestant = api.prizes.addContestant.useMutation();
  const handleSubmit = async () => {
    await addContestant.mutateAsync({
      prizeId: prizeId,
      slug: slug,
    });
    await utils.prizes.getContestants.invalidate(prizeId);
  };
  return (
    <Button
      disabled={addContestant.isPending}
      onClick={handleSubmit}
      className="mt-5 w-full"
    >
      Join Contest
    </Button>
  );
}

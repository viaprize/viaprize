import { ProposalCard } from "@/components/admin/proposal-card";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
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
  const proposals = await api.prizes.getPendingPrizes();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}

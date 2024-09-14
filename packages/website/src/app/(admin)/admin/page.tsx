import { auth } from "@/server/auth";
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
    <div className=" h-dvh w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
      {/* Main content area with sidebar and children */}
      <div className="flex md:flex-row flex-col h-full">
        <div className="w-full h-full flex-col flex">p</div>
      </div>
    </div>
  );
}

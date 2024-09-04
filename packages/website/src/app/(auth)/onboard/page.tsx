import Image from "next/image";

import OnboardCard from "@/components/auth/onboard-card";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }
  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <OnboardCard email={session?.user.email} name={session?.user.name} />

        <div className="hidden bg-muted lg:block">
          <Image
            src="https://picsum.photos/200"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}

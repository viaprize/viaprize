import Image from "next/image";

import LoginCard from "@/components/auth/login-card";

export default function Dashboard() {
  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <LoginCard />

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

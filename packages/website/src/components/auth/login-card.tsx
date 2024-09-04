import Link from "next/link";
import { EmailAuthButton } from "./email-auth-button";
import GithubAuthButton from "./github-auth-button";
import GoogleAuthButton from "./google-auth-button";
export default function LoginCard() {
  return (
    <>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Select Login Method Below
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <EmailAuthButton />
            </div>
            <div className="grid gap-2">
              <GithubAuthButton />
            </div>
            <div className="grid gap-2">
              <GoogleAuthButton />
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

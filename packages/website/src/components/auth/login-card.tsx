import { REDIRECT_TO_AFTER_AUTH } from "@/lib/constant";
import { EmailAuthButton } from "./email-auth-button";
import GithubAuthButton from "./github-auth-button";
import GoogleAuthButton from "./google-auth-button";
export default function LoginCard() {
  return (
    <>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login/Sign up</h1>
            <p className="text-balance text-muted-foreground">
              If you are an existing user you will be logged in else you would
              be told to sign up
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <EmailAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
            </div>
            <div className="grid gap-2">
              <GithubAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
            </div>
            <div className="grid gap-2">
              <GoogleAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

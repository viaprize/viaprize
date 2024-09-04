import { nextAuth } from "@/server/auth";
import { Button } from "@viaprize/ui/button";

export default function GithubAuthButton() {
  return (
    <Button
      onClick={async () => {
        "use server";
        await nextAuth.signIn("github");
      }}
      className="w-full"
    >
      Login with Github
    </Button>
  );
}

import { nextAuth } from "@/server/auth";
import { Button } from "@viaprize/ui/button";

export default function GithubAuthButton({
  redirectTo,
}: {
  redirectTo?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await nextAuth.signIn("github", {
          redirect: !!redirectTo,
          redirectTo: redirectTo,
        });
      }}
    >
      <Button type="submit" className="w-full">
        Login with Github
      </Button>
    </form>
  );
}

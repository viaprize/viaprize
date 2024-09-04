import { nextAuth } from "@/server/auth";
import { Button } from "@viaprize/ui/button";

export default function GoogleAuthButton() {
  return (
    <Button
      onClick={async () => {
        "use server";
        await nextAuth.signIn("google");
      }}
      className="w-full"
    >
      Login with Google
    </Button>
  );
}

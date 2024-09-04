import { nextAuth } from "@/server/auth";
import { Button } from "@viaprize/ui/button";
import { Input } from "@viaprize/ui/input";
import { Label } from "@viaprize/ui/label";
export function EmailAuthButton() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await nextAuth.signIn("resend", formData);
      }}
    >
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" required />
      <Button type="submit" className="my-4 w-full">
        Login with Email
      </Button>
    </form>
  );
}

import { nextAuth } from "@/server/auth";
import { Button } from "@viaprize/ui/button";
import { Input } from "@viaprize/ui/input";
import { Label } from "@viaprize/ui/label";
export function EmailAuthButton({ redirectTo }: { redirectTo?: string }) {
  return (
    <form
      action={async (formData) => {
        "use server";
        console.log(formData);
        await nextAuth.signIn("resend", {
          email: formData.get("email"),
          redirect: !!redirectTo,
          redirectTo: redirectTo,
        });
      }}
    >
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="email" required />
      <Button type="submit" className="my-4 w-full">
        Login with Email
      </Button>
    </form>
  );
}

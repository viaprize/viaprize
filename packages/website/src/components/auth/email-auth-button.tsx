import { signIn } from '@/server/auth'
import { Button } from '@viaPrize/ui/button'
import { Input } from '@viaPrize/ui/input'
import { Label } from '@viaPrize/ui/label'
import { Mail } from 'lucide-react'

export function EmailAuthButton({ redirectTo }: { redirectTo: string }) {
  return (
    <form
      action={async (formData) => {
        'use server'
        const email = formData.get('email') as string
        await signIn('resend', {
          email,
          redirect: true,
          redirectTo,
        })
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
        />
        <Button type="submit" className="w-full">
          <Mail className="mr-2 h-4 w-4" /> Continue with Email
        </Button>
      </div>
    </form>
  )
}

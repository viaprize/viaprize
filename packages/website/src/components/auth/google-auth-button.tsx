import { signIn } from '@/server/auth'
import { Button } from '@viaprize/ui/button'

export default function GoogleAuthButton({
  redirectTo,
}: {
  redirectTo?: string
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('google', {
          redirect: !!redirectTo,
          redirectTo: redirectTo,
        })
      }}
    >
      <Button type="submit" className="w-full">
        Login with Google
      </Button>
    </form>
  )
}

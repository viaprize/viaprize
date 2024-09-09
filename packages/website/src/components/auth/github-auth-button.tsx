import { signIn } from '@/server/auth'
import { Button } from '@viaprize/ui/button'
import { Github } from 'lucide-react'
export default function GithubAuthButton({
  redirectTo,
}: {
  redirectTo?: string
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('github', {
          redirect: !!redirectTo,
          redirectTo: redirectTo,
        })
      }}
    >
      <Button variant="outline" type="submit" className="w-full">
        <Github className="mr-2 h-4 w-4" /> Github
      </Button>
    </form>
  )
}

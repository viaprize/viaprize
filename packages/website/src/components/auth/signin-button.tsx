import { nextAuth } from '@/server/auth'

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server'
        await nextAuth.signIn()
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  )
}

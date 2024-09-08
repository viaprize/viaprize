// import { REDIRECT_TO_AFTER_AUTH } from '@/lib/constant'
// import { EmailAuthButton } from './email-auth-button'
// import GithubAuthButton from './github-auth-button'
// import GoogleAuthButton from './google-auth-button'
// import { WalletLogin } from './wallet-login'
// export default function LoginCard() {
//   return (
//     <>
//       <div className="flex items-center justify-center py-12">
//         <div className="mx-auto grid w-[350px] gap-6">
//           <div className="grid gap-2 text-center">
//             <h1 className="text-3xl font-bold">Login/Sign up</h1>
//             <p className="text-balance text-muted-foreground">
//               If you are an existing user you will be logged in else you would
//               be told to sign up
//             </p>
//           </div>
//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <EmailAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
//             </div>
//             <div className="grid gap-2">
//               <GithubAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
//             </div>
//             <div className="grid gap-2">
//               <GoogleAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
//             </div>
//             <div className="grid gap-2">
//               <WalletLogin />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

import { REDIRECT_TO_AFTER_AUTH } from '@/lib/constant'
import { Button } from '@viaPrize/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@viaprize/ui/card'
import { Separator } from '@viaprize/ui/separator'
import { Github, Mail, Wallet } from 'lucide-react'
import { EmailAuthButton } from './email-auth-button'
import GithubAuthButton from './github-auth-button'
import GoogleAuthButton from './google-auth-button'
import { WalletLogin } from './wallet-login'

// Define an arbitrary redirect URL
// const REDIRECT_TO_AFTER_AUTH = "/dashboard";

export default function LoginCard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <Card className="w-[400px] shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Login or sign up to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-1">
            <GithubAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground rounded-md">
                Or continue with
              </span>
            </div>
          </div>
          <EmailAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} />
          {/* <GithubAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} /> */}
          {/* <GoogleAuthButton redirectTo={REDIRECT_TO_AFTER_AUTH} /> */}
          <Separator />
          <WalletLogin />
        </CardContent>
      </Card>
    </div>
  )
}

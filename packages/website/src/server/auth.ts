import { env } from '@/env'
import { SIWE_PUBLIC_MESSAGE } from '@/lib/constant'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { viaprize } from './viaprize'

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username?: string
      id?: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}

const SiweProvider = Credentials({
  id: 'siwe',
  name: 'Siwe',
  credentials: {
    message: { label: 'Message', type: 'text' },
    signedMessage: { label: 'Signed Message', type: 'text' },
  },
  async authorize(credentials) {
    if (!credentials?.signedMessage || !credentials?.message) {
      return null
    }

    try {
      // On the Client side, the SiweMessage()
      // will be constructed like this:
      //
      // const siwe = new SiweMessage({
      //   address: address,
      //   statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
      //   nonce: await getCsrfToken(),
      //   expirationTime: new Date(Date.now() + 2*60*60*1000).toString(),
      //   chainId: chain?.id
      // });

      const siwe = new SiweMessage(JSON.parse(credentials.message as any))
      const result = await siwe.verify({
        signature: credentials.signedMessage as string,
        nonce: await getCsrfToken(),
      })

      if (!result.success) throw new Error('Invalid Signature')

      if (result.data.statement !== SIWE_PUBLIC_MESSAGE)
        throw new Error('Statement Mismatch')

      // if (new Date(result.data.expirationTime as string) < new Date())
      //   throw new Error("Signature Already expired");
      console.log('Returning')
      return {
        id: siwe.address,
      }
    } catch (error) {
      console.log(error)
      return null
    }
  },
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Resend({
      from: 'support@auth.viaprize.org',
    }),
    Github,
    SiweProvider,
  ],
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) {
        throw new Error('No sub')
      }
      const username = await viaprize.users.getUserNameById(token.sub)

      return { ...token, username }
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          id: token.sub,
        },
      }
    },
  },

  adapter: DrizzleAdapter(viaprize.database.database),
  session: {
    strategy: 'jwt',
  },
  debug: env.NODE_ENV === 'development',
})

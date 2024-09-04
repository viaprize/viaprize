import { env } from "@/env";
import { SIWE_PUBLIC_MESSAGE } from "@/lib/constant";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { viaprize } from "./viaprize";
const SiweProvider = Credentials({
  id: "siwe",
  name: "Siwe",
  credentials: {
    message: { label: "Message", type: "text" },
    signedMessage: { label: "Signed Message", type: "text" },
  },
  async authorize(credentials) {
    if (!credentials?.signedMessage || !credentials?.message) {
      return null;
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

      const siwe = new SiweMessage(JSON.parse(credentials.message as any));
      const result = await siwe.verify({
        signature: credentials.signedMessage as string,
        nonce: await getCsrfToken(),
      });

      if (!result.success) throw new Error("Invalid Signature");

      if (result.data.statement !== SIWE_PUBLIC_MESSAGE)
        throw new Error("Statement Mismatch");

      // if (new Date(result.data.expirationTime as string) < new Date())
      //   throw new Error("Signature Already expired");
      console.log("Returning");
      return {
        id: siwe.address,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});

export const nextAuth = NextAuth({
  providers: [
    Google,
    Resend({
      from: "support@auth.viaprize.org",
    }),
    Github,
    SiweProvider,
  ],

  callbacks: {
    async jwt({ account, token, user, profile, session, trigger }) {
      console.log({ account });
      console.log({ user });
      console.log({ profile });
      console.log({ session });
      console.log({ trigger });
      console.log({ token });

      if (!user.id) {
        throw new AuthError("User ID not found");
      }
      if (!account?.providerAccountId) {
        throw new AuthError("Account ID not found");
      }
      switch (trigger) {
        case "signUp":
          await viaprize.users
            .updateUserById(user.id, {
              email: user.email,
              authId: account.providerAccountId,
              provider: account.provider,
            })
            .catch((error) => {
              throw new AuthError(error.message);
            });
          break;
        case "signIn":
          break;
        case "update":
          break;
        default:
          break;
      }
      return token;
    },
  },
  adapter: DrizzleAdapter(viaprize.database.database),
  session: {
    strategy: "jwt",
  },
  debug: env.NODE_ENV === "development",
});

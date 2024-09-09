import { env } from "@/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe-viem";
import { viaprize } from "./viaprize";

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username?: string;
      id?: string;
      walletAddress?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

const SiweProvider = Credentials({
  name: "siwe",
  credentials: {
    message: { label: "Message", type: "text" },
    signedMessage: { label: "Signed Message", type: "text" },
  },

  async authorize(credentials, req) {
    console.log("credentials", credentials);
    if (!credentials?.signedMessage || !credentials?.message) {
      return null;
    }

    console.log("Verifying", credentials.message);
    const siwe = new SiweMessage(JSON.parse(credentials.message as string));
    const result = await siwe.verify({
      signature: credentials.signedMessage as string,
      domain: new URL(req.url).host,
      nonce: cookies().get("authjs.csrf-token")?.value.split("|")[0] ?? "1",
    });

    if (!result.success) throw new CredentialsSignin("Invalid Signature");

    const user = await viaprize.users.getUserByWalletAddress(
      result.data.address
    );
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    const userId = await viaprize.users.createUserFromWalletAddress({
      network: "optimism",
      walletAddress: result.data.address.toLowerCase(),
    });

    return {
      id: userId,
    };
  },
});

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    Google,
    Resend({
      from: "support@auth.viaprize.org",
    }),
    Github,
    SiweProvider,
  ],
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) {
        throw new Error("No sub");
      }
      const user = await viaprize.users.getUserById(token.sub);
      return {
        ...token,
        name: user?.name,
        email: user?.email,
        username: user?.username,
        walletAddress: user?.wallets[0]?.address,
      };
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          id: token.sub,
          walletAddress: token.walletAddress,
        },
      };
    },
  },

  adapter: DrizzleAdapter(viaprize.database.database),
  session: {
    strategy: "jwt",
  },
  debug: env.NODE_ENV === "development",
});

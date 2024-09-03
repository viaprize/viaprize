import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { viaprize } from "./viaprize";
export const nextAuth = NextAuth({
  providers: [Google, Resend, Github],
  adapter: DrizzleAdapter(viaprize.database.database),
  session: {
    strategy: "jwt",
  },
});

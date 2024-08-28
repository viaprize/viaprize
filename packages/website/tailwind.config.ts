import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwind from "@viaprize/ui/tailwind";

export default {
  content: ["./src/**/*.tsx", "../ui/**/*.{ts,tsx}"],
  presets: [tailwind],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
} satisfies Config;

import tailwind from '@viaprize/ui/tailwind'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.tsx', '../ui/src/**/*.{ts,tsx}'],
  presets: [tailwind],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
    },
  },
} satisfies Config

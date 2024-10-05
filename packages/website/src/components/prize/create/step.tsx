'use client'

import { motion } from 'framer-motion'

export default function Step({
  step,
  currentStep,
}: {
  step: number
  currentStep: number
}) {
  const status =
    currentStep === step
      ? 'active'
      : currentStep < step
        ? 'inactive'
        : 'complete'

  return (
    <motion.div animate={status} className="relative">
      {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
      <motion.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.2,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: 'tween',
          ease: 'circOut',
        }}
        className="absolute inset-0 rounded-full bg-muted-foreground"
      ></motion.div>

      <motion.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: 'hsl(var(--muted))',
            borderColor: 'hsl(var(--muted-foreground))',
            color: 'hsl(var(--muted-foreground))',
          },
          active: {
            backgroundColor: 'hsl(var(--primary))',
            borderColor: 'hsl(var(--primary))',
            color: 'hsl(var(--background))',
          },
          complete: {
            backgroundColor: 'hsl(var(--primary))',
            borderColor: 'hsl(var(--muted-foreground))',
            color: 'hsl(var(--background))',
          },
        }}
        transition={{ duration: 0.2 }}
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2  font-semibold`}
      >
        <div className="flex items-center justify-center">
          {status === 'complete' ? (
            <CheckIcon className="h-6 w-6 text-background" />
          ) : (
            <span>{step}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function CheckIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

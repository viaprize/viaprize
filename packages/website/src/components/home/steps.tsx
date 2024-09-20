'use client'

import { cn } from '@viaprize/ui'
import { Card } from '@viaprize/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    title: 'Create a Prize',
    description: (
      <ul className="list-disc list-inside space-y-1">
        <li>Post your project idea</li>
        <li>Define functions and objectives</li>
        <li>Set judging criteria</li>
        <li>Set a deadline for submissions</li>
      </ul>
    ),
    image:
      'https://images.placeholders.dev/?width=350&height=100&text=create_prize',
    icon: <Circle className="w-6 h-6" />,
  },
  {
    title: 'Crowdfund a Prize',
    description: (
      <ul className="list-disc list-inside space-y-1">
        <li>Fund a prize to attract global talents</li>
        <li>Invite more funders to increase the prize pool</li>
      </ul>
    ),
    image:
      'https://images.placeholders.dev/?width=350&height=100&text=crowdfund_prize',
  },
  {
    title: 'Vote for the Winner',
    description: (
      <ul className="list-disc list-inside space-y-1">
        <li>Look through submissions</li>
        <li>Funder(s) select the best project(s)</li>
        <li>Prize is distributed to the winner(s)</li>
        <li>Judges can vote for a refund</li>
      </ul>
    ),
    image:
      'https://images.placeholders.dev/?width=350&height=100&text=voteForWinner',
  },
]

export default function StepsForFunders() {
  const [currentStep, setCurrentStep] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    // Set up a new timer for 4 seconds
    timerRef.current = setTimeout(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length)
    }, 4000)

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentStep])

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
  }

  return (
    <div className="flex flex-col w-full max-w-screen-2xl mx-auto gap-8 py-24 md:py-40">
      {/* Header */}
      <h2 className="text-4xl max-w-xl text-balance mx-auto font-medium text-center">
        Refundable Prizes,{' '}
        <span className="text-primary">Results-based Guarantees</span>
      </h2>

      {/* Steps */}
      <div className="w-full grid md:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          return (
            <Card
              key={step.title}
              className={cn(
                'flex flex-col w-full p-4 cursor-pointer transition-all duration-300 hover:shadow-md',
                isActive ? 'border-primary shadow-lg' : 'border-muted',
                isCompleted ? 'bg-primary/5' : 'bg-background',
              )}
              onClick={() => handleStepClick(index)}
            >
              <div className="w-full h-2 relative bg-gray-300 rounded-full overflow-hidden mb-2">
                <div
                  key={currentStep === index ? currentStep : undefined}
                  className={`absolute h-full inset-0 rounded-full bg-primary ${
                    index === currentStep ? 'progress-bar' : ''
                  }`}
                  style={{
                    width: index < currentStep ? '100%' : '0%',
                  }}
                />
              </div>
              <div className="flex items-center space-x-4">
                {/* Icon */}
                {/* <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                    isCompleted ? "bg-primary text-primary-foreground" : ""
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    step.icon || <Circle className="w-6 h-6" />
                  )}
                </div> */}

                {/* Title and Description */}
                <div className="flex-grow">
                  <h3
                    className={cn(
                      'text-lg font-semibold transition-colors duration-300',
                      isActive ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {step.title}
                  </h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Image */}
      <div className="w-full">
        <img
          src={steps[currentStep]?.image ?? ''}
          alt={`Step ${currentStep + 1}`}
          width={600}
          height={400}
          className="rounded-lg object-cover w-full h-auto"
        />
      </div>
      <style jsx>{`
        .progress-bar {
          animation: progressAnimation 4s linear forwards;
        }

        @keyframes progressAnimation {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

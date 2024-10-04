'use client'

import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@viaprize/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@viaprize/ui/card'
import { Form } from '@viaprize/ui/form'
import { Skeleton } from '@viaprize/ui/skeleton'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { DescriptionStep } from './description-step'
import { type FormValues, type Question, formSchema } from './form-schema'
import { QuestionsStep } from './questions-step'
import { SkillsCategoryStep } from './skills-catagories-step'
import { TimingStep } from './times-step'
import { TitleDescriptionStep } from './title-description-step'

export default function BountyCreationForm() {
  const [step, setStep] = useState(5)
  const [initialQuestion, setInitialQuestion] = useState<Question | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      aiQuestions: [],
      title: '',
      fullDescription: '',
      skills: [],
      category: '',
      // submissionStartDate: new Date(),
      // submissionEndDate: new Date(),
      // votingEndDate: new Date(),
    },
  })

  const { mutateAsync: generateQuestion, isPending: generatingQuestions } =
    api.prizes.ai.generateInitialQuestion.useMutation()
  const {
    mutateAsync: generateTitleAndDescription,
    isPending: generatingTitleAndDescription,
  } = api.prizes.ai.generateTitleAndDescription.useMutation()

  const {
    mutateAsync: generateSkillsAndCatagories,
    isPending: generatingSkills,
  } = api.prizes.ai.generateSkillsCategory.useMutation()

  const onSubmit = (values: FormValues) => {
    console.log(values)
    // Handle form submission
  }

  const handleNextStep = async () => {
    if (step === 1) {
      const description = form.getValues('description')
      setStep(2)
      const questions = await generateQuestion({ description })
      setInitialQuestion(questions)
    } else if (step === 2) {
      const answers = form.getValues('aiQuestions')
      console.log(answers, 'answers')
      setStep(3)
      const suggestions = await generateTitleAndDescription({
        userChoices: answers,
        description: form.getValues('description'),
      })
      form.setValue('title', suggestions.title)
      form.setValue('fullDescription', suggestions.description)
    } else if (step === 3) {
      setStep(4)
      const skillsAndCatagories = await generateSkillsAndCatagories({
        title: form.getValues('title'),
        fullDescription: form.getValues('fullDescription'),
      })
      form.setValue(
        'skills',
        skillsAndCatagories.skills.map((s) => {
          return {
            label: s.skill,
            value: s.skill.toLowerCase().replace(' ', '_'),
          }
        }),
      )
      form.setValue('category', skillsAndCatagories.category)
    } else {
      setStep(step + 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DescriptionStep form={form} />
      case 2:
        return generatingQuestions ? (
          <QuestionsStepSkeleton />
        ) : (
          initialQuestion && (
            <QuestionsStep form={form} initialQuestion={initialQuestion} />
          )
        )
      case 3:
        return generatingTitleAndDescription ? (
          <TitleDescriptionStepSkeleton />
        ) : (
          <TitleDescriptionStep form={form} />
        )
      case 4:
        return generatingSkills ? (
          <SkillsStepSkeleton />
        ) : (
          <SkillsCategoryStep form={form} />
        )
      case 5:
        return <TimingStep form={form} />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Bounty</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}
            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < 5 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={
                    generatingQuestions || generatingTitleAndDescription
                  }
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Create Bounty</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function QuestionsStepSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

function TitleDescriptionStepSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

function SkillsStepSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

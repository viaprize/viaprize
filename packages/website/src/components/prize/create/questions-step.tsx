'use client'

import { api } from '@/trpc/react'
import { Button } from '@viaprize/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Label } from '@viaprize/ui/label'
import { RadioGroup, RadioGroupItem } from '@viaprize/ui/radio-group'
import { Skeleton } from '@viaprize/ui/skeleton'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { FormValues, Question } from './form-schema'
import TopicsSelector, { type Topic } from './topic-selector'

type QuestionsStepProps = {
  form: UseFormReturn<FormValues>
  initialQuestion: Question
}

export function QuestionsStep({ form, initialQuestion }: QuestionsStepProps) {
  const [questions, setQuestions] = useState<Question[]>([initialQuestion])
  const {
    mutateAsync: generateFollowUpQuestions,
    isPending: generatingQuestions,
  } = api.prizes.ai.generateFollowUpQuestions.useMutation()

  const handleAnswerSelected = async (
    index: number,
    selectedAnswer: string | string[],
  ) => {
    form.setValue(`aiQuestions.${index}`, {
      question: questions[index]?.question ?? '',
      answer: selectedAnswer,
    })

    if (index === questions.length - 1 && questions.length < 5) {
      console.log(form.getValues('aiQuestions'))
      const nextQuestion = await generateFollowUpQuestions({
        description: form.getValues('description'),
        previousQuestionsAndAnswer: form.getValues('aiQuestions'),
      })
      setQuestions((prevQuestions) => [...prevQuestions, nextQuestion])
    }
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.question} className="space-y-4">
          <div className="text-sm text-gray-500">Question {index + 1}</div>
          {question.multipleChoice ? (
            <MultipleChoiceQuestion
              question={question}
              onAnswerSelected={(answer) => handleAnswerSelected(index, answer)}
              form={form}
              index={index}
            />
          ) : (
            <SingleChoiceQuestion
              question={question}
              onAnswerSelected={(answer) => handleAnswerSelected(index, answer)}
              form={form}
              index={index}
            />
          )}
        </div>
      ))}
      {generatingQuestions && <QuestionsStepSkeleton />}
    </div>
  )
}

type QuestionProps = {
  question: Question
  onAnswerSelected: (answer: string | string[]) => void
  form: UseFormReturn<any>
  index: number
}

function SingleChoiceQuestion({
  question,
  onAnswerSelected,
  form,
  index,
}: QuestionProps) {
  return (
    <FormField
      control={form.control}
      name={`aiQuestions.${index}.answer`}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{question.question}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value)
                onAnswerSelected(value)
              }}
              value={field.value}
              className="space-y-1"
            >
              {question.options.map((option, optionIndex) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}-${optionIndex}`}
                  />
                  <Label htmlFor={`option-${index}-${optionIndex}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function MultipleChoiceQuestion({
  question,
  onAnswerSelected,
  form,
  index,
}: QuestionProps) {
  const topics: Topic[] = question.options.map((option) => ({
    value: option,
    label: option,
    icon: '📌',
  }))

  return (
    <FormField
      control={form.control}
      name={`aiQuestions.${index}.answer`}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{question.question}</FormLabel>
          <FormControl>
            <TopicsSelector
              topics={topics}
              setSelectedTopics={(selected) => {
                const answer = selected.map((s) => s.value)
                field.onChange(answer)
              }}
              selectedTopics={
                field.value
                  ? field.value.map((v: string) => ({
                      value: v,
                      label: v,
                      icon: '📌',
                    }))
                  : []
              }
              allowAddOptions={true}
            />
          </FormControl>
          <FormMessage />
          <Button type="button" onClick={() => onAnswerSelected(field.value)}>
            Next Question
          </Button>
        </FormItem>
      )}
    />
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

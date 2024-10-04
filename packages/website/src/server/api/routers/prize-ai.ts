import { questionSchema } from '@/types/prize-form'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const prizesAiRouter = createTRPCRouter({
  generateInitialQuestion: protectedProcedure
    .input(
      z.object({
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await generateObject({
        model: openai('gpt-4o-mini-2024-07-18', {
          structuredOutputs: true,
        }),
        schemaName: 'questions',
        schemaDescription: 'generate questions and options',
        schema: z.object({
          questions: questionSchema.extend({
            multipleChoice: z.boolean(),
          }),
        }),
        prompt: `The user is looking to create a bounty or a prize, and here are his basic needs, now we need to understand his request much more better way, so ask questions to get more information, dont ask rubbish questions, ask only relevant questions, by which you can get to exact points he is looking for
          here is a short description of the user's request: ${input.description}, questions can be single option or multiple choice
          dont ask questions about budget and time, we will ask them later
          make sure to give minimum 4 options
          `,
      })
      return result.object.questions
    }),
  generateFollowUpQuestions: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        previousQuestionsAndAnswer: z.array(
          z.object({
            question: z.string(),
            answer: z.string().or(z.array(z.string())),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const previouslyAnsweredQuestionString = input.previousQuestionsAndAnswer
        .map((question) => `${question.question}: ${question.answer}`)
        .join(', ')
      const result = await generateObject({
        model: openai('gpt-4o-mini-2024-07-18', {
          structuredOutputs: true,
        }),
        schemaName: 'followUpQuestions',
        schemaDescription: 'generate follow up questions',
        schema: z.object({
          questions: questionSchema.extend({
            multipleChoice: z.boolean(),
          }),
        }),
        prompt: `The user is looking to create a bounty or a prize, and here are his basic needs, 
        now we need to understand his request much more better way, so ask questions to get more information, 
        dont ask rubbish questions, ask only relevant questions, I already asked him few questions
         <previousQuestionsAndAnswer>
        ${previouslyAnsweredQuestionString}
        <previousQuestionsAndAnswer>
        and here is a small description about user need 
        <description>
        ${input.description}
        <description>
        make sure to give minimum 4 options

        now ask one question that will be the most important question, to know what is his purpose
          `,
      })
      return result.object.questions
    }),
  generateTitleAndDescription: protectedProcedure
    .input(
      z.object({
        userChoices: z.array(
          z.object({
            question: z.string(),
            answer: z.string().or(z.array(z.string())),
          }),
        ),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userChoicesString = input.userChoices
        .map((choice) => `${choice.question}: ${choice.answer}`)
        .join(', ')
      const result = await generateObject({
        model: openai('gpt-4o-mini-2024-07-18', {
          structuredOutputs: true,
        }),
        schemaName: 'titleAndDescription',
        schemaDescription: 'generate title and description',
        schema: z.object({
          title: z.string(),
          description: z.string(),
        }),
        prompt: `The user is looking to create a bounty or a prize, and here are his basic needs, now we need to create a proper title and description
        based on the answer he gave to our questions and also he made gave us a short description about what he wants
        choices: ${userChoicesString}
        \n\nDescription: ${input.description}`,
      })
      return result.object
    }),
})

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
      // Commented out original code
      /*
      const result = await generateObject({
        // ... (original code)
      })
      return result.object.questions
      */

      // Return dummy data
      return {
        question: "What is the primary programming language for this project?",
        options: ["JavaScript", "Python", "Java", "C++"],
        multipleChoice: true
      }
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
      // Commented out original code
      /*
      const previouslyAnsweredQuestionString = input.previousQuestionsAndAnswer
        .map((question) => `${question.question}: ${question.answer}`)
        .join(', ')
      const result = await generateObject({
        // ... (original code)
      })
      return result.object.questions
      */

      // Return dummy data
      return {
        question: "What is the expected project timeline?",
        options: ["1-2 weeks", "1-2 months", "3-6 months", "6+ months"],
        multipleChoice: true
      }
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
      // Commented out original code
      /*
      const userChoicesString = input.userChoices
        .map((choice) => `${choice.question}: ${choice.answer}`)
        .join(', ')
      console.log('userChoicesString', userChoicesString, input)
      const result = await generateObject({
        // ... (original code)
      })
      return result.object
      */

      // Return dummy data
      return {
        title: "Develop a React-based E-commerce Platform",
        description: "• Create responsive online store\n• Implement secure payment gateway\n• Design user-friendly product catalog\n• Integrate inventory management system"
      }
    }),

  generateSkillsCategory: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        fullDescription: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // Commented out original code
      /*
      const result = await generateObject({
        // ... (original code)
      })
      return result.object
      */

      // Return dummy data
      return {
        skills: [
          { icon: "react", skill: "React" },
          { icon: "js", skill: "JavaScript" },
          { icon: "node", skill: "Node.js" },
          { icon: "database", skill: "MongoDB" }
        ],
        category: "Web Development"
      }
    }),
})

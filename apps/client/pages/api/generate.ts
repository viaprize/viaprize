import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { prompt } = JSON.parse(req.body) as { prompt: string };

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      res
        .status(500)
        .send('This feature is currently under progress. Please check back later.');
    }

    const openai = new OpenAI({
      apiKey: openaiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `You are an AI writing assistant that continues existing text based on context from prior text. 
            Give more weight/priority to the later characters than the beginning ones.
            Limit your response to no more than 200 characters, but make sure to construct complete sentences.

            here is the content
            ${prompt}
            `,
          // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
          // "Use Markdown formatting when appropriate.",
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    });

    const finalRes = response.choices[0].message.content;
    console.log(response.usage);

    res.status(200).send(finalRes);
  } catch (error) {
    console.error('Error generating:', error);
    res.status(500).json({ error: 'Failed to generate', message: error });
  }
}

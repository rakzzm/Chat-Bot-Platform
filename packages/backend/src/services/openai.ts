import OpenAI from 'openai';
import { Bot, Message } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function getChatResponse(
  bot: Bot,
  messages: Message[]
): Promise<string> {
  const systemMessage = bot.systemPrompt || 'You are a helpful assistant.';

  const openaiMessages = [
    { role: 'system' as const, content: systemMessage },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const response = await openai.chat.completions.create({
    model: bot.model || 'gpt-3.5-turbo',
    messages: openaiMessages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || 'Sorry, I could not process that.';
}

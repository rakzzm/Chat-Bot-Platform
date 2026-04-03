import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';
import { getChatResponse } from '../services/openai';

const sendMessageSchema = z.object({
  botId: z.string(),
  message: z.string().min(1),
});

export const conversationRouter = Router();

conversationRouter.use(authenticate);

conversationRouter.get('/', async (req: Request, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.userId! },
      include: { bot: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations);
  } catch {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

conversationRouter.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

conversationRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { botId, message } = sendMessageSchema.parse(req.body);

    const bot = await prisma.bot.findFirst({
      where: { id: botId, userId: req.userId! },
    });
    if (!bot) return res.status(404).json({ error: 'Bot not found' });

    let conversation = await prisma.conversation.findFirst({
      where: { botId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          botId,
          userId: req.userId!,
          title: message.slice(0, 50),
        },
      });
    }

    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });

    const aiResponse = await getChatResponse(bot, messages);

    const botMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    res.json({ conversation, userMessage, botMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

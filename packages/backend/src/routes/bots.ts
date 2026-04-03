import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';

const createBotSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  systemPrompt: z.string().optional(),
  avatar: z.string().optional(),
  model: z.string().default('gpt-3.5-turbo'),
  settings: z.record(z.unknown()).optional(),
});

export const botRouter = Router();

botRouter.use(authenticate);

botRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const bots = await prisma.bot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bots);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
});

botRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const bot = await prisma.bot.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!bot) return res.status(404).json({ error: 'Bot not found' });
    res.json(bot);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
});

botRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = createBotSchema.parse(req.body);
    const bot = await prisma.bot.create({
      data: { ...data, userId: req.userId! },
    });
    res.status(201).json(bot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create bot' });
  }
});

botRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const bot = await prisma.bot.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!bot) return res.status(404).json({ error: 'Bot not found' });

    const updated = await prisma.bot.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update bot' });
  }
});

botRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const bot = await prisma.bot.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!bot) return res.status(404).json({ error: 'Bot not found' });

    await prisma.bot.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete bot' });
  }
});

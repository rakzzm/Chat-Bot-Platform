import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';

const createLabelSchema = z.object({
  title: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const subscriberRouter = Router();
subscriberRouter.use(authenticate);

// Get subscribers
subscriberRouter.get('/subscribers', async (req: Request, res: Response) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { userId: req.userId! },
      include: { labels: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Get labels
subscriberRouter.get('/labels', async (req: Request, res: Response) => {
  try {
    const labels = await prisma.label.findMany({
      orderBy: { title: 'asc' },
    });
    res.json(labels);
  } catch {
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// Create label
subscriberRouter.post('/labels', async (req: Request, res: Response) => {
  try {
    const data = createLabelSchema.parse(req.body);
    const label = await prisma.label.create({ data });
    res.status(201).json(label);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// Update label
subscriberRouter.patch('/labels/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.label.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update label' });
  }
});

// Delete label
subscriberRouter.delete('/labels/:id', async (req: Request, res: Response) => {
  try {
    await prisma.label.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

// Add label to subscriber
subscriberRouter.post('/subscribers/:id/labels', async (req: Request, res: Response) => {
  try {
    const { labelId } = req.body;
    await prisma.subscriber.update({
      where: { id: req.params.id },
      data: { labels: { connect: { id: labelId } } },
    });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to add label' });
  }
});

// Remove label from subscriber
subscriberRouter.delete('/subscribers/:subscriberId/labels/:labelId', async (req: Request, res: Response) => {
  try {
    await prisma.subscriber.update({
      where: { id: req.params.subscriberId },
      data: { labels: { disconnect: { id: req.params.labelId } } },
    });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to remove label' });
  }
});

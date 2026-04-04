import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';

const createIntentSchema = z.object({
  name: z.string().min(1),
  examples: z.array(z.string()),
  responses: z.array(z.string()).optional(),
});

const createEntitySchema = z.object({
  name: z.string().min(1),
  values: z.array(z.unknown()),
});

export const nluRouter = Router();
nluRouter.use(authenticate);

// Get intents
nluRouter.get('/nlu/intents', async (req: Request, res: Response) => {
  try {
    const intents = await prisma.nluIntent.findMany({
      where: { userId: req.userId! },
      orderBy: { name: 'asc' },
    });
    res.json(intents.map((i) => ({ ...i, examples: JSON.parse(i.examples), responses: i.responses ? JSON.parse(i.responses) : null })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch intents' });
  }
});

// Create intent
nluRouter.post('/nlu/intents', async (req: Request, res: Response) => {
  try {
    const data = createIntentSchema.parse(req.body);
    const intent = await prisma.nluIntent.create({
      data: {
        ...data,
        userId: req.userId!,
        examples: JSON.stringify(data.examples),
        responses: data.responses ? JSON.stringify(data.responses) : null,
      },
    });
    res.status(201).json({ ...intent, examples: JSON.parse(intent.examples), responses: intent.responses ? JSON.parse(intent.responses) : null });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create intent' });
  }
});

// Update intent
nluRouter.patch('/nlu/intents/:id', async (req: Request, res: Response) => {
  try {
    const updateData: Record<string, unknown> = { ...req.body };
    if (updateData.examples) updateData.examples = JSON.stringify(updateData.examples);
    if (updateData.responses) updateData.responses = JSON.stringify(updateData.responses);

    const updated = await prisma.nluIntent.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json({ ...updated, examples: JSON.parse(updated.examples), responses: updated.responses ? JSON.parse(updated.responses) : null });
  } catch {
    res.status(500).json({ error: 'Failed to update intent' });
  }
});

// Delete intent
nluRouter.delete('/nlu/intents/:id', async (req: Request, res: Response) => {
  try {
    await prisma.nluIntent.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete intent' });
  }
});

// Get entities
nluRouter.get('/nlu/entities', async (req: Request, res: Response) => {
  try {
    const entities = await prisma.nluEntity.findMany({
      where: { userId: req.userId! },
      orderBy: { name: 'asc' },
    });
    res.json(entities.map((e) => ({ ...e, values: JSON.parse(e.values) })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// Create entity
nluRouter.post('/nlu/entities', async (req: Request, res: Response) => {
  try {
    const data = createEntitySchema.parse(req.body);
    const entity = await prisma.nluEntity.create({
      data: { ...data, userId: req.userId!, values: JSON.stringify(data.values) },
    });
    res.status(201).json({ ...entity, values: JSON.parse(entity.values) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create entity' });
  }
});

// Update entity
nluRouter.patch('/nlu/entities/:id', async (req: Request, res: Response) => {
  try {
    const updateData: Record<string, unknown> = { ...req.body };
    if (updateData.values) updateData.values = JSON.stringify(updateData.values);

    const updated = await prisma.nluEntity.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json({ ...updated, values: JSON.parse(updated.values) });
  } catch {
    res.status(500).json({ error: 'Failed to update entity' });
  }
});

// Delete entity
nluRouter.delete('/nlu/entities/:id', async (req: Request, res: Response) => {
  try {
    await prisma.nluEntity.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete entity' });
  }
});

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';

const createKBSchema = z.object({
  title: z.string().min(1),
  contentType: z.string(),
  fields: z.record(z.unknown()).optional().default({}),
  entries: z.array(z.unknown()).optional().default([]),
});

const createCVSchema = z.object({
  name: z.string().min(1),
  permanent: z.boolean().optional().default(false),
  defaultValue: z.string().optional(),
});

export const cmsRouter = Router();
cmsRouter.use(authenticate);

// Knowledge Base
cmsRouter.get('/knowledge', async (req: Request, res: Response) => {
  try {
    const kbs = await prisma.knowledgeBase.findMany({
      where: { userId: req.userId! },
      orderBy: { title: 'asc' },
    });
    res.json(kbs.map((kb) => ({ ...kb, fields: JSON.parse(kb.fields), entries: JSON.parse(kb.entries) })));
  } catch {
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

cmsRouter.post('/knowledge', async (req: Request, res: Response) => {
  try {
    const data = createKBSchema.parse(req.body);
    const kb = await prisma.knowledgeBase.create({
      data: { ...data, userId: req.userId!, fields: JSON.stringify(data.fields), entries: JSON.stringify(data.entries) },
    });
    res.status(201).json({ ...kb, fields: JSON.parse(kb.fields), entries: JSON.parse(kb.entries) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create knowledge base' });
  }
});

cmsRouter.patch('/knowledge/:id', async (req: Request, res: Response) => {
  try {
    const updateData: Record<string, unknown> = { ...req.body };
    if (updateData.fields) updateData.fields = JSON.stringify(updateData.fields);
    if (updateData.entries) updateData.entries = JSON.stringify(updateData.entries);

    const updated = await prisma.knowledgeBase.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json({ ...updated, fields: JSON.parse(updated.fields), entries: JSON.parse(updated.entries) });
  } catch {
    res.status(500).json({ error: 'Failed to update knowledge base' });
  }
});

cmsRouter.delete('/knowledge/:id', async (req: Request, res: Response) => {
  try {
    await prisma.knowledgeBase.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete knowledge base' });
  }
});

// Context Variables
cmsRouter.get('/context-variables', async (req: Request, res: Response) => {
  try {
    const vars = await prisma.contextVariable.findMany({
      where: { userId: req.userId! },
      orderBy: { name: 'asc' },
    });
    res.json(vars);
  } catch {
    res.status(500).json({ error: 'Failed to fetch context variables' });
  }
});

cmsRouter.post('/context-variables', async (req: Request, res: Response) => {
  try {
    const data = createCVSchema.parse(req.body);
    const cv = await prisma.contextVariable.create({
      data: { ...data, userId: req.userId! },
    });
    res.status(201).json(cv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create context variable' });
  }
});

cmsRouter.patch('/context-variables/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.contextVariable.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update context variable' });
  }
});

cmsRouter.delete('/context-variables/:id', async (req: Request, res: Response) => {
  try {
    await prisma.contextVariable.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete context variable' });
  }
});

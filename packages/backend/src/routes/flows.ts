import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';

const createFlowSchema = z.object({
  label: z.string().min(1),
  botId: z.string(),
  isStart: z.boolean().optional().default(false),
});

const createNodeSchema = z.object({
  flowId: z.string(),
  type: z.string(),
  positionX: z.number().default(0),
  positionY: z.number().default(0),
  data: z.string().default('{}'),
});

const updateNodeSchema = z.object({
  type: z.string().optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  data: z.string().optional(),
});

const createConnectionSchema = z.object({
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  label: z.string().optional(),
});

export const flowRouter = Router();
flowRouter.use(authenticate);

// Get flows for a bot
flowRouter.get('/bots/:botId/flows', async (req: Request, res: Response) => {
  try {
    const flows = await prisma.flow.findMany({
      where: { botId: req.params.botId, userId: req.userId! },
      orderBy: { createdAt: 'asc' },
    });
    res.json(flows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch flows' });
  }
});

// Get single flow with nodes and connections
flowRouter.get('/flows/:id', async (req: Request, res: Response) => {
  try {
    const flow = await prisma.flow.findFirst({
      where: { id: req.params.id, userId: req.userId! },
      include: {
        nodes: {
          include: {
            sourceConnections: true,
            targetConnections: true,
          },
        },
      },
    });
    if (!flow) return res.status(404).json({ error: 'Flow not found' });

    const connections = flow.nodes.flatMap((node) => [
      ...(node.sourceConnections || []).map((c) => ({
        id: c.id,
        sourceNodeId: c.sourceNodeId,
        targetNodeId: c.targetNodeId,
        label: c.label,
      })),
    ]);

    const nodes = flow.nodes.map((n) => ({
      id: n.id,
      flowId: n.flowId,
      type: n.type,
      positionX: n.positionX,
      positionY: n.positionY,
      data: n.data,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));

    res.json({ ...flow, nodes, connections });
  } catch {
    res.status(500).json({ error: 'Failed to fetch flow' });
  }
});

// Create flow
flowRouter.post('/flows', async (req: Request, res: Response) => {
  try {
    const data = createFlowSchema.parse(req.body);
    const flow = await prisma.flow.create({
      data: {
        label: data.label,
        botId: data.botId,
        userId: req.userId!,
        isStart: data.isStart,
      },
    });
    res.status(201).json(flow);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create flow' });
  }
});

// Update flow
flowRouter.patch('/flows/:id', async (req: Request, res: Response) => {
  try {
    const flow = await prisma.flow.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!flow) return res.status(404).json({ error: 'Flow not found' });

    const updated = await prisma.flow.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update flow' });
  }
});

// Delete flow
flowRouter.delete('/flows/:id', async (req: Request, res: Response) => {
  try {
    const flow = await prisma.flow.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!flow) return res.status(404).json({ error: 'Flow not found' });

    await prisma.flow.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete flow' });
  }
});

// Create flow node
flowRouter.post('/flows/nodes', async (req: Request, res: Response) => {
  try {
    const data = createNodeSchema.parse(req.body);
    const node = await prisma.flowNode.create({
      data: {
        flowId: data.flowId,
        type: data.type,
        positionX: data.positionX,
        positionY: data.positionY,
        data: data.data,
      },
    });
    res.status(201).json(node);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create node' });
  }
});

// Update flow node
flowRouter.patch('/flows/nodes/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.flowNode.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update node' });
  }
});

// Delete flow node
flowRouter.delete('/flows/nodes/:id', async (req: Request, res: Response) => {
  try {
    await prisma.flowNode.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete node' });
  }
});

// Create flow connection
flowRouter.post('/flows/connections', async (req: Request, res: Response) => {
  try {
    const data = createConnectionSchema.parse(req.body);
    const connection = await prisma.flowConnection.create({
      data: {
        sourceNodeId: data.sourceNodeId,
        targetNodeId: data.targetNodeId,
        label: data.label,
      },
    });
    res.status(201).json(connection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

// Delete flow connection
flowRouter.delete('/flows/connections/:id', async (req: Request, res: Response) => {
  try {
    await prisma.flowConnection.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

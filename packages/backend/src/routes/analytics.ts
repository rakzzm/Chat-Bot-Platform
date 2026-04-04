import { Router, Request, Response } from 'express';
import { prisma } from '../utils/database';
import { authenticate } from '../middleware/auth';

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);

analyticsRouter.get('/analytics', async (req: Request, res: Response) => {
  try {
    const { botId } = req.query;
    const where: Record<string, unknown> = { userId: req.userId! };
    if (botId) where.botId = botId;

    const [totalConversations, totalMessages] = await Promise.all([
      prisma.conversation.count({ where: where as any }),
      prisma.message.count({
        where: {
          conversation: where as any,
        },
      }),
    ]);

    // @ts-expect-error Prisma groupBy circular type reference
    const topBots = await prisma.conversation.groupBy({
      by: ['botId'],
      _count: true,
      where: where as any,
      orderBy: { _count: 'desc' },
      take: 5,
    }) as any;

    const botIds = topBots.map((b) => b.botId);
    const bots = await prisma.bot.findMany({
      where: { id: { in: botIds } },
      select: { id: true, name: true },
    });

    const topBotsWithNames = topBots.map((b) => {
      const bot = bots.find((bt) => bt.id === b.botId);
      return { id: b.botId, name: bot?.name || 'Unknown', count: b._count };
    });

    res.json({
      totalConversations,
      totalMessages,
      conversationsByDay: [],
      topBots: topBotsWithNames,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

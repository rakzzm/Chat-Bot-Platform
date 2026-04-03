import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { connectDB } from './utils/database';
import { authRouter } from './routes/auth';
import { botRouter } from './routes/bots';
import { conversationRouter } from './routes/conversations';
import { setupWebSocket } from './websocket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/bots', botRouter);
app.use('/api/conversations', conversationRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

setupWebSocket(wss);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
});

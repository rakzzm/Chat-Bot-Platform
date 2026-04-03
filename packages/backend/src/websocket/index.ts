import { WebSocketServer, WebSocket } from 'ws';

interface Client {
  ws: WebSocket;
  userId?: string;
  conversationId?: string;
}

const clients: Client[] = [];

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    const client: Client = { ws };
    clients.push(client);

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        handleMessage(client, message);
      } catch {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      const index = clients.indexOf(client);
      if (index > -1) clients.splice(index, 1);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

function handleMessage(client: Client, message: Record<string, unknown>) {
  switch (message.type) {
    case 'join':
      client.userId = message.userId as string;
      client.conversationId = message.conversationId as string;
      break;
    case 'message':
      broadcastToConversation(client.conversationId, {
        type: 'message',
        payload: message.payload,
        sender: client.userId,
      });
      break;
    case 'typing':
      broadcastToConversation(client.conversationId, {
        type: 'typing',
        userId: client.userId,
      }, client);
      break;
    default:
      client.ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
  }
}

function broadcastToConversation(
  conversationId: string | undefined,
  data: Record<string, unknown>,
  exclude?: Client
) {
  const payload = JSON.stringify(data);
  clients.forEach((c) => {
    if (c !== exclude && c.conversationId === conversationId && c.ws.readyState === WebSocket.OPEN) {
      c.ws.send(payload);
    }
  });
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bot {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string | null;
  avatar: string | null;
  model: string;
  settings: Record<string, unknown> | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  botId: string;
  userId: string;
  bot?: Bot;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  conversationId: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateBotRequest {
  name: string;
  description?: string;
  systemPrompt?: string;
  avatar?: string;
  model?: string;
  settings?: Record<string, unknown>;
}

export interface SendMessageRequest {
  botId: string;
  message: string;
}

export interface SendMessageResponse {
  conversation: Conversation;
  userMessage: Message;
  botMessage: Message;
}

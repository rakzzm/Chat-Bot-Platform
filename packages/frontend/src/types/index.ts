export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
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
  subscriberId: string | null;
  status: string;
  assignedTo: string | null;
  bot?: Bot;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: string | null;
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

export interface Flow {
  id: string;
  label: string;
  botId: string;
  userId: string;
  isStart: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlowNode {
  id: string;
  flowId: string;
  type: string;
  positionX: number;
  positionY: number;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FlowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string | null;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  firstName: string | null;
  lastName: string | null;
  channel: string;
  gender: string | null;
  locale: string | null;
  userId: string;
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  title: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NluIntent {
  id: string;
  name: string;
  userId: string;
  examples: string[];
  responses: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface NluEntity {
  id: string;
  name: string;
  userId: string;
  values: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  contentType: string;
  userId: string;
  fields: Record<string, unknown>;
  entries: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

export interface ContextVariable {
  id: string;
  name: string;
  permanent: boolean;
  defaultValue: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  botId: string | null;
  userId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

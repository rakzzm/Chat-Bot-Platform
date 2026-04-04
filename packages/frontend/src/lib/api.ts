import axios from 'axios';
import type {
  AuthResponse,
  CreateBotRequest,
  Bot,
  Conversation,
  Message,
  SendMessageRequest,
  SendMessageResponse,
  Flow,
  FlowNode,
  FlowConnection,
  Subscriber,
  Label,
  NluIntent,
  NluEntity,
  KnowledgeBase,
  ContextVariable,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  setAuthToken(data.token);
  return data;
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name });
  setAuthToken(data.token);
  return data;
}

export async function getBots(): Promise<Bot[]> {
  const { data } = await api.get<Bot[]>('/bots');
  return data;
}

export async function getBot(id: string): Promise<Bot> {
  const { data } = await api.get<Bot>(`/bots/${id}`);
  return data;
}

export async function createBot(payload: CreateBotRequest): Promise<Bot> {
  const { data } = await api.post<Bot>('/bots', payload);
  return data;
}

export async function updateBot(id: string, payload: Partial<CreateBotRequest>): Promise<Bot> {
  const { data } = await api.patch<Bot>(`/bots/${id}`, payload);
  return data;
}

export async function deleteBot(id: string): Promise<void> {
  await api.delete(`/bots/${id}`);
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>('/conversations');
  return data;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
  return data;
}

export async function sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>('/conversations', payload);
  return data;
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  const { data } = await api.get<Conversation>(`/conversations/${conversationId}`);
  return data;
}

export async function updateConversation(conversationId: string, payload: Partial<Conversation>): Promise<Conversation> {
  const { data } = await api.patch<Conversation>(`/conversations/${conversationId}`, payload);
  return data;
}

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const { data } = await api.get('/health');
  return data;
}

// Flows
export async function getFlows(botId: string): Promise<Flow[]> {
  const { data } = await api.get<Flow[]>(`/bots/${botId}/flows`);
  return data;
}

export async function getFlow(id: string): Promise<Flow & { nodes: FlowNode[]; connections: FlowConnection[] }> {
  const { data } = await api.get(`/flows/${id}`);
  return data;
}

export async function createFlow(payload: { label: string; botId: string; isStart?: boolean }): Promise<Flow> {
  const { data } = await api.post<Flow>('/flows', payload);
  return data;
}

export async function updateFlow(id: string, payload: Partial<Flow>): Promise<Flow> {
  const { data } = await api.patch<Flow>(`/flows/${id}`, payload);
  return data;
}

export async function deleteFlow(id: string): Promise<void> {
  await api.delete(`/flows/${id}`);
}

export async function getFlowNodes(flowId: string): Promise<FlowNode[]> {
  const { data } = await api.get<FlowNode[]>(`/flows/${flowId}/nodes`);
  return data;
}

export async function createFlowNode(payload: { flowId: string; type: string; positionX: number; positionY: number; data: Record<string, unknown> }): Promise<FlowNode> {
  const { data } = await api.post<FlowNode>('/flows/nodes', payload);
  return data;
}

export async function updateFlowNode(id: string, payload: Partial<FlowNode>): Promise<FlowNode> {
  const { data } = await api.patch<FlowNode>(`/flows/nodes/${id}`, payload);
  return data;
}

export async function deleteFlowNode(id: string): Promise<void> {
  await api.delete(`/flows/nodes/${id}`);
}

export async function createFlowConnection(payload: { sourceNodeId: string; targetNodeId: string; label?: string }): Promise<FlowConnection> {
  const { data } = await api.post<FlowConnection>('/flows/connections', payload);
  return data;
}

export async function deleteFlowConnection(id: string): Promise<void> {
  await api.delete(`/flows/connections/${id}`);
}

// Subscribers & Labels
export async function getSubscribers(): Promise<Subscriber[]> {
  const { data } = await api.get<Subscriber[]>('/subscribers');
  return data;
}

export async function getLabels(): Promise<Label[]> {
  const { data } = await api.get<Label[]>('/labels');
  return data;
}

export async function createLabel(payload: { title: string; name: string; description?: string }): Promise<Label> {
  const { data } = await api.post<Label>('/labels', payload);
  return data;
}

export async function updateLabel(id: string, payload: Partial<Label>): Promise<Label> {
  const { data } = await api.patch<Label>(`/labels/${id}`, payload);
  return data;
}

export async function deleteLabel(id: string): Promise<void> {
  await api.delete(`/labels/${id}`);
}

export async function addSubscriberLabel(subscriberId: string, labelId: string): Promise<void> {
  await api.post(`/subscribers/${subscriberId}/labels`, { labelId });
}

export async function removeSubscriberLabel(subscriberId: string, labelId: string): Promise<void> {
  await api.delete(`/subscribers/${subscriberId}/labels/${labelId}`);
}

// NLU
export async function getNluIntents(): Promise<NluIntent[]> {
  const { data } = await api.get<NluIntent[]>('/nlu/intents');
  return data;
}

export async function createNluIntent(payload: { name: string; examples: string[]; responses?: string[] }): Promise<NluIntent> {
  const { data } = await api.post<NluIntent>('/nlu/intents', payload);
  return data;
}

export async function updateNluIntent(id: string, payload: Partial<NluIntent>): Promise<NluIntent> {
  const { data } = await api.patch<NluIntent>(`/nlu/intents/${id}`, payload);
  return data;
}

export async function deleteNluIntent(id: string): Promise<void> {
  await api.delete(`/nlu/intents/${id}`);
}

export async function getNluEntities(): Promise<NluEntity[]> {
  const { data } = await api.get<NluEntity[]>('/nlu/entities');
  return data;
}

export async function createNluEntity(payload: { name: string; values: Record<string, unknown>[] }): Promise<NluEntity> {
  const { data } = await api.post<NluEntity>('/nlu/entities', payload);
  return data;
}

export async function updateNluEntity(id: string, payload: Partial<NluEntity>): Promise<NluEntity> {
  const { data } = await api.patch<NluEntity>(`/nlu/entities/${id}`, payload);
  return data;
}

export async function deleteNluEntity(id: string): Promise<void> {
  await api.delete(`/nlu/entities/${id}`);
}

// Knowledge Base
export async function getKnowledgeBases(): Promise<KnowledgeBase[]> {
  const { data } = await api.get<KnowledgeBase[]>('/knowledge');
  return data;
}

export async function createKnowledgeBase(payload: { title: string; contentType: string; fields?: Record<string, unknown>; entries?: Record<string, unknown>[] }): Promise<KnowledgeBase> {
  const { data } = await api.post<KnowledgeBase>('/knowledge', payload);
  return data;
}

export async function updateKnowledgeBase(id: string, payload: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
  const { data } = await api.patch<KnowledgeBase>(`/knowledge/${id}`, payload);
  return data;
}

export async function deleteKnowledgeBase(id: string): Promise<void> {
  await api.delete(`/knowledge/${id}`);
}

// Context Variables
export async function getContextVariables(): Promise<ContextVariable[]> {
  const { data } = await api.get<ContextVariable[]>('/context-variables');
  return data;
}

export async function createContextVariable(payload: { name: string; permanent?: boolean; defaultValue?: string }): Promise<ContextVariable> {
  const { data } = await api.post<ContextVariable>('/context-variables', payload);
  return data;
}

export async function updateContextVariable(id: string, payload: Partial<ContextVariable>): Promise<ContextVariable> {
  const { data } = await api.patch<ContextVariable>(`/context-variables/${id}`, payload);
  return data;
}

export async function deleteContextVariable(id: string): Promise<void> {
  await api.delete(`/context-variables/${id}`);
}

// Analytics
export async function getAnalytics(botId?: string): Promise<{ totalConversations: number; totalMessages: number; conversationsByDay: { date: string; count: number }[]; topBots: { id: string; name: string; count: number }[] }> {
  const { data } = await api.get('/analytics', { params: { botId } });
  return data;
}

export default api;

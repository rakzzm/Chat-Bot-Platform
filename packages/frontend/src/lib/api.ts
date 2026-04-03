import axios from 'axios';
import type {
  AuthResponse,
  CreateBotRequest,
  Bot,
  Conversation,
  Message,
  SendMessageRequest,
  SendMessageResponse,
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

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const { data } = await api.get('/health');
  return data;
}

export default api;

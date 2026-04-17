import { http } from './http';
import type { AuthUser } from '../types/domain';

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'teacher';
}) {
  const { data } = await http.post<AuthPayload>('/auth/register', input);
  return data;
}

export async function loginUser(input: { email: string; password: string }) {
  const { data } = await http.post<AuthPayload>('/auth/login', input);
  return data;
}

export async function getCurrentUser() {
  const { data } = await http.get<AuthUser>('/auth/me');
  return data;
}

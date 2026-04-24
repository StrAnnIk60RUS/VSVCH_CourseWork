import { http } from './http';

export async function getProfile() {
  const { data } = await http.get('/users');
  return data as { id: string; email: string; name: string };
}

export async function updateProfileName(name: string) {
  const { data } = await http.put('/users', { name });
  return data as { id: string; email: string; name: string };
}

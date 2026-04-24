import { http } from './http';

export async function getReminders() {
  const { data } = await http.get('/reminders');
  return data as { items: Array<{ id: string; title: string; remindAt: string }> };
}

export async function createReminder(title: string, remindAt: string) {
  const { data } = await http.post('/reminders', { title, remindAt });
  return data as { id: string; title: string; remindAt: string };
}

export async function updateReminder(id: string, title: string, remindAt: string) {
  const { data } = await http.put(`/reminders/${id}`, { title, remindAt });
  return data as { id: string; title: string; remindAt: string };
}

export async function deleteReminder(id: string) {
  await http.delete(`/reminders/${id}`);
}

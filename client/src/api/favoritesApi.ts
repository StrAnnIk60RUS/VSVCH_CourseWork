import { http } from './http';

export async function getFavorites() {
  const { data } = await http.get('/favorites');
  return data as {
    items: Array<{
      id: string;
      courseId: string;
      course: { id: string; title: string; language: string; level: string };
    }>;
  };
}

export async function addFavorite(courseId: string) {
  await http.post('/favorites', { courseId });
}

export async function removeFavorite(courseId: string) {
  await http.delete(`/favorites/${courseId}`);
}

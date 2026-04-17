import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { completeLesson, getApiError, getLessonExercises, submitExercise } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

export default function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams();
  const [exercises, setExercises] = useState<Array<{ id: string; title: string; payload?: { question?: string } }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    getLessonExercises(courseId, lessonId)
      .then((res) => setExercises(res.items))
      .catch((err) => setError(getApiError(err)));
  }, [courseId, lessonId]);

  return (
    <PageShell title="Урок" description="Контент урока, упражнения и фиксация прогресса.">
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <SectionCard title="Действия прогресса">
          <button
            type="button"
            onClick={async () => {
              const res = await completeLesson(courseId, lessonId);
              setProgress(res.progress);
            }}
            className="rounded border border-slate-300 px-3 py-2"
          >
            Отметить урок как пройденный
          </button>
          {progress !== null && <p className="mt-2 text-sm">Текущий прогресс: {progress}%</p>}
        </SectionCard>
        <SectionCard title="Упражнения">
          <div className="mt-2 space-y-3">
            {exercises.map((ex) => (
              <div key={ex.id} className="rounded border border-slate-200 p-3">
                <p className="font-medium">{ex.title}</p>
                <p className="text-sm text-slate-600">{ex.payload?.question ?? 'Вопрос не указан'}</p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={answers[ex.id] ?? ''}
                    onChange={(e) => setAnswers((x) => ({ ...x, [ex.id]: e.target.value }))}
                    className="w-full rounded border border-slate-300 px-3 py-2"
                    placeholder="Ваш ответ"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await submitExercise(ex.id, answers[ex.id] ?? '');
                      setResult(res.correct ? `Верно (+${res.score})` : `Неверно (+${res.score})`);
                      setProgress(res.progress);
                    }}
                    className="rounded border border-slate-300 px-3 py-2"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            ))}
          </div>
          {result && <p className="mt-3 text-sm">{result}</p>}
        </SectionCard>
      </div>
    </PageShell>
  );
}

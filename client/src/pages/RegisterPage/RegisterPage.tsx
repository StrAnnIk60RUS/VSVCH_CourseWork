import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiError, registerUser } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { STORAGE_KEYS } from '../../constants/storage';
import { useAppDispatch } from '../../store/hooks';
import { setSession } from '../../store/slices/appSlice';

type RegisterRole = 'student' | 'teacher';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RegisterRole>('student');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const auth = await registerUser({ name, email, password, role });
      localStorage.setItem(STORAGE_KEYS.token, auth.token);
      dispatch(setSession(auth));
      navigate('/courses');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell title="Регистрация" description="Создайте аккаунт студента или преподавателя.">
      <div className="mx-auto max-w-xl">
        <SectionCard title="Новый аккаунт">
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Имя"
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Email"
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Пароль"
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RegisterRole)}
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-brand-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Создание...' : 'Создать аккаунт'}
            </button>
          </form>
          <p className="mt-3 text-sm text-slate-600">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

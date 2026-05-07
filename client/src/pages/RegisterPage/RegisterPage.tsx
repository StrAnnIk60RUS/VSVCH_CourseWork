import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiError, registerUser } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { STORAGE_KEYS } from '../../constants/storage';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useI18n } from '../../hooks/useI18n';

type RegisterRole = 'student' | 'teacher';

export default function RegisterPage() {
  const t = useI18n();
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuthSession();
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
      setAuthenticatedUser(auth.user);
      navigate('/courses');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell title={t.register.pageTitle} description={t.register.pageDescription}>
      <div className="mx-auto max-w-xl">
        <SectionCard title={t.register.cardTitle}>
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder={t.register.namePlaceholder}
              className="ui-input w-full rounded px-3 py-2"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Email"
              className="ui-input w-full rounded px-3 py-2"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder={t.register.passwordPlaceholder}
              className="ui-input w-full rounded px-3 py-2"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RegisterRole)}
              className="ui-input w-full rounded px-3 py-2"
            >
              <option value="student">{t.register.roleStudent}</option>
              <option value="teacher">{t.register.roleTeacher}</option>
            </select>
            {error && <p className="text-sm text-ui-danger">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="ui-btn-primary"
            >
              {isSubmitting ? t.register.submitPending : t.register.submitIdle}
            </button>
          </form>
          <p className="mt-3 text-sm text-ui-muted">
            {t.register.haveAccount}{' '}
            <Link to="/login" className="ui-link-anim text-ui-link">
              {t.register.loginLink}
            </Link>
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

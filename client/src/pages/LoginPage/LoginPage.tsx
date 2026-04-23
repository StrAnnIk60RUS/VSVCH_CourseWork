import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getApiError } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { STORAGE_KEYS } from '../../constants/storage';
import { useI18n } from '../../hooks/useI18n';
import { useAppDispatch } from '../../store/hooks';
import { setSession } from '../../store/slices/appSlice';

export default function LoginPage() {
  const t = useI18n();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const auth = await loginUser({ email, password });
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
    <PageShell title={t.login.pageTitle} description={t.login.pageDescription}>
      <div className="mx-auto max-w-xl">
        <SectionCard title={t.login.cardTitle}>
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
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
              placeholder={t.login.passwordPlaceholder}
              className="ui-input w-full rounded px-3 py-2"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-brand-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {isSubmitting ? t.login.submitPending : t.login.submitIdle}
            </button>
          </form>
          <p className="mt-3 text-sm text-ui-muted">
            {t.login.noAccount}{' '}
            <Link to="/register" className="text-ui-link hover:text-ui-link-hover">
              {t.login.registerLink}
            </Link>
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

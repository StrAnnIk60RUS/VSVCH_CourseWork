import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getApiError } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { STORAGE_KEYS } from '../../constants/storage';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useI18n } from '../../hooks/useI18n';

export default function LoginPage() {
  const t = useI18n();
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuthSession();
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
      setAuthenticatedUser(auth.user);
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
            {error && <p className="text-sm text-ui-danger">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="ui-btn-primary"
            >
              {isSubmitting ? t.login.submitPending : t.login.submitIdle}
            </button>
          </form>
          <p className="mt-3 text-sm text-ui-muted">
            {t.login.noAccount}{' '}
            <Link to="/register" className="ui-link-anim text-ui-link">
              {t.login.registerLink}
            </Link>
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}

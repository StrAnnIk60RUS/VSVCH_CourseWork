import { useEffect, useState } from 'react';
import { clearAppStorage } from '../../constants/storage';
import { getApiError, getProfile, updateProfileName } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';

export default function ProfilePage() {
  const t = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setName(profile.name);
        setEmail(profile.email);
      })
      .catch((err) => setStatus(getApiError(err)));
  }, []);

  return (
    <PageShell title={t.profile.pageTitle} description={t.profile.pageDescription}>
      <div className="space-y-4">
        <SectionCard title={t.profile.profileData}>
          <p className="text-sm text-ui-muted">
            {t.profile.email}: {email}
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ui-input w-full rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                await updateProfileName(name);
                setStatus(t.profile.nameUpdated);
              }}
              className="ui-button-secondary rounded px-3 py-2"
            >
              {t.profile.save}
            </button>
          </div>
        </SectionCard>
        <SectionCard title={t.profile.resetUi}>
          <button
            type="button"
            onClick={() => {
              clearAppStorage();
              setStatus(t.profile.localSettingsReset);
            }}
            className="ui-button-secondary rounded px-3 py-2"
          >
            {t.profile.resetButton}
          </button>
        </SectionCard>
        {status && <p className="text-sm text-ui-muted">{status}</p>}
      </div>
    </PageShell>
  );
}

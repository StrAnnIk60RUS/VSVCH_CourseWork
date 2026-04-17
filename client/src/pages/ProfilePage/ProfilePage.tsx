import { useEffect, useState } from 'react';
import { clearAppStorage } from '../../constants/storage';
import { getApiError, getProfile, updateProfileName } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

export default function ProfilePage() {
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
    <PageShell title="Профиль" description="Профиль пользователя и сброс UI-настроек.">
      <div className="space-y-4">
        <SectionCard title="Данные профиля">
          <p className="text-sm text-slate-600">Email: {email}</p>
          <div className="mt-3 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                await updateProfileName(name);
                setStatus('Имя обновлено');
              }}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Сохранить
            </button>
          </div>
        </SectionCard>
        <SectionCard title="Сброс интерфейса">
          <button
            type="button"
            onClick={() => {
              clearAppStorage();
              setStatus('Локальные настройки сброшены');
            }}
            className="rounded border border-slate-300 px-3 py-2"
          >
            Сбросить настройки интерфейса
          </button>
        </SectionCard>
        {status && <p className="text-sm">{status}</p>}
      </div>
    </PageShell>
  );
}

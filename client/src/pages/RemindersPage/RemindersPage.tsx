import { useEffect, useState } from 'react';
import {
  createReminder,
  deleteReminder,
  getApiError,
  getReminders,
  updateReminder,
} from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

export default function RemindersPage() {
  const [items, setItems] = useState<Array<{ id: string; title: string; remindAt: string }>>([]);
  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [status, setStatus] = useState('');

  const toIsoDateTime = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toISOString();
  };

  useEffect(() => {
    getReminders()
      .then((res) => setItems(res.items))
      .catch((err) => setStatus(getApiError(err)));
  }, []);

  return (
    <PageShell title="Напоминания" description="CRUD напоминаний с обратной связью.">
      <div className="space-y-4">
        <SectionCard title="Создать напоминание">
          <div className="mt-2 grid gap-2 md:grid-cols-[1fr_14rem_auto]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              type="datetime-local"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                const trimmedTitle = title.trim();
                if (!trimmedTitle) {
                  setStatus('Введите название напоминания');
                  return;
                }
                const remindAtIso = toIsoDateTime(remindAt);
                if (!remindAtIso) {
                  setStatus('Укажите корректную дату и время');
                  return;
                }
                try {
                  const created = await createReminder(trimmedTitle, remindAtIso);
                  setItems((prev) => [...prev, created]);
                  setStatus('Напоминание создано');
                  setTitle('');
                  setRemindAt('');
                } catch (err) {
                  setStatus(getApiError(err));
                }
              }}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Создать
            </button>
          </div>
          {status && <p className="mt-2 text-sm">{status}</p>}
        </SectionCard>
        <SectionCard title="Список">
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    {item.title} — {new Date(item.remindAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const updated = await updateReminder(item.id, item.title, item.remindAt);
                          setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
                          setStatus('Напоминание обновлено');
                        } catch (err) {
                          setStatus(getApiError(err));
                        }
                      }}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteReminder(item.id);
                          setItems((prev) => prev.filter((x) => x.id !== item.id));
                          setStatus('Напоминание удалено');
                        } catch (err) {
                          setStatus(getApiError(err));
                        }
                      }}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}

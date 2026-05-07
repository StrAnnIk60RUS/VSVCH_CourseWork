import { useEffect, useState } from 'react';
import {
  createReminder,
  deleteReminder,
  getApiError,
  getReminders,
  updateReminder,
} from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';

type ReminderItem = { id: string; title: string; remindAt: string };

const toIsoDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
};

const isoToInputDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatRemindAt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });

export default function RemindersPage() {
  const t = useI18n();
  const [items, setItems] = useState<Array<ReminderItem>>([]);
  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [initialFetchFailed, setInitialFetchFailed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editRemindAt, setEditRemindAt] = useState('');

  const showSuccess = (message: string) => {
    setFeedbackSuccess(message);
    setFeedbackError('');
  };

  const showError = (message: string) => {
    setFeedbackError(message);
    setFeedbackSuccess('');
  };

  useEffect(() => {
    getReminders()
      .then((res) => {
        setItems(res.items);
        setInitialFetchFailed(false);
        setFeedbackError('');
      })
      .catch((err) => {
        setInitialFetchFailed(true);
        setFeedbackError(getApiError(err) || t.reminders.loadFailedFallback);
        setFeedbackSuccess('');
      });
  }, [t.reminders.loadFailedFallback]);

  const startEdit = (item: ReminderItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditRemindAt(isoToInputDateTime(item.remindAt));
    setFeedbackSuccess('');
    setFeedbackError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditRemindAt('');
  };

  const saveEdit = async (item: ReminderItem) => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      showError(t.reminders.titleRequired);
      return;
    }
    const remindAtIso = toIsoDateTime(editRemindAt);
    if (!remindAtIso) {
      showError(t.reminders.dateRequired);
      return;
    }
    try {
      const updated = await updateReminder(item.id, trimmedTitle, remindAtIso);
      setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
      showSuccess(t.reminders.editSaved);
      cancelEdit();
    } catch (err) {
      showError(getApiError(err));
    }
  };

  return (
    <PageShell
      title={t.reminders.pageTitle}
      description={t.reminders.pageDescription}
    >
      <div className="space-y-4">
        {feedbackSuccess && (
          <p className="text-sm text-ui-success" role="status">
            {feedbackSuccess}
          </p>
        )}
        {feedbackError && (
          <p className="text-sm text-ui-danger" role="alert">
            {feedbackError}
          </p>
        )}
        <SectionCard title={t.reminders.newSection}>
          <div className="mt-2 grid gap-2 md:grid-cols-[1fr_14rem_auto]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.reminders.titlePlaceholder}
              className="ui-input rounded px-3 py-2"
              aria-label={t.reminders.titleAria}
            />
            <input
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              type="datetime-local"
              className="ui-input rounded px-3 py-2"
              aria-label={t.reminders.dateAria}
            />
            <button
              type="button"
              onClick={async () => {
                const trimmedTitle = title.trim();
                if (!trimmedTitle) {
                  showError(t.reminders.titleRequired);
                  return;
                }
                const remindAtIso = toIsoDateTime(remindAt);
                if (!remindAtIso) {
                  showError(t.reminders.dateRequired);
                  return;
                }
                try {
                  const created = await createReminder(trimmedTitle, remindAtIso);
                  setItems((prev) => [...prev, created]);
                  showSuccess(t.reminders.added);
                  setTitle('');
                  setRemindAt('');
                } catch (err) {
                  showError(getApiError(err));
                }
              }}
              className="ui-btn-primary"
            >
              {t.reminders.add}
            </button>
          </div>
        </SectionCard>
        <SectionCard title={t.reminders.yourSection}>
          {items.length === 0 && !initialFetchFailed ? (
            <p className="mt-2 text-sm text-ui-muted">
              {t.reminders.empty}
            </p>
          ) : items.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {items.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <li
                    key={item.id}
                    className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
                  >
                    {isEditing ? (
                      <div className="grid gap-2 md:grid-cols-[1fr_14rem_auto]">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder={t.reminders.titlePlaceholder}
                          className="ui-input rounded px-3 py-2"
                          aria-label={t.reminders.titleAria}
                        />
                        <input
                          value={editRemindAt}
                          onChange={(e) => setEditRemindAt(e.target.value)}
                          type="datetime-local"
                          className="ui-input rounded px-3 py-2"
                          aria-label={t.reminders.dateAria}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(item)}
                            className="ui-btn-primary text-sm"
                          >
                            {t.reminders.save}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="ui-btn-secondary text-sm"
                          >
                            {t.reminders.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-ui-text">
                          {item.title} — {formatRemindAt(item.remindAt)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="ui-btn-secondary text-sm"
                          >
                            {t.reminders.edit}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteReminder(item.id);
                                setItems((prev) => prev.filter((x) => x.id !== item.id));
                                showSuccess(t.reminders.deleted);
                                if (editingId === item.id) {
                                  cancelEdit();
                                }
                              } catch (err) {
                                showError(getApiError(err));
                              }
                            }}
                            className="ui-btn-danger text-sm"
                          >
                            {t.reminders.delete}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </SectionCard>
      </div>
    </PageShell>
  );
}

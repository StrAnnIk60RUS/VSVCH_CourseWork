import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

type ToastTone = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  dismissToast: (id: number) => void;
  items: ToastItem[];
};

const TOAST_TTL_MS = 4000;

const ToastContext = createContext<ToastContextValue | null>(null);

function toneClasses(tone: ToastTone): string {
  if (tone === 'success') {
    return 'border-ui-success bg-ui-surface text-ui-success';
  }
  if (tone === 'error') {
    return 'border-ui-danger bg-ui-surface text-ui-danger';
  }
  return 'border-ui-link bg-ui-surface text-ui-link';
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seqRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;
      const id = ++seqRef.current;
      setItems((prev) => [...prev, { id, tone, message: trimmed }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, TOAST_TTL_MS);
    },
    [dismissToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showSuccess: (message) => push('success', message),
      showError: (message) => push('error', message),
      showInfo: (message) => push('info', message),
      dismissToast,
      items,
    }),
    [dismissToast, items, push],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}

export function ToastViewport() {
  const { items, dismissToast } = useToast();
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex max-h-[70vh] w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 overflow-y-auto">
      {items.map((item) => (
        <div
          key={item.id}
          role={item.tone === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto rounded border px-3 py-2 text-sm shadow-lg ${toneClasses(item.tone)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="leading-snug">{item.message}</p>
            <button
              type="button"
              aria-label="Close notification"
              onClick={() => dismissToast(item.id)}
              className="text-xs opacity-80 hover:opacity-100"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

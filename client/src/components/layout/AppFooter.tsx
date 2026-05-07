import { useI18n } from '../../hooks/useI18n';

export function AppFooter() {
  const t = useI18n();

  return (
    <footer className="mt-auto border-t border-ui-border bg-ui-surface">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-ui-muted">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}

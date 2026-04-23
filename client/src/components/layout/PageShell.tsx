import type { ReactNode } from 'react';

type PageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="min-h-dvh bg-ui-bg">
      <header className="border-b border-ui-border bg-ui-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <h1 className="text-3xl font-semibold tracking-tight text-ui-text">{title}</h1>
          <p className="mt-2 max-w-3xl text-base text-ui-muted">{description}</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>
    </div>
  );
}

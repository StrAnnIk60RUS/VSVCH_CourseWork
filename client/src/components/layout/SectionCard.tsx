import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-ui-border bg-ui-surface p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-ui-text">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-ui-muted">{children}</div>
    </section>
  );
}

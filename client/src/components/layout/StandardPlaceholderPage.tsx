import { PageShell } from './PageShell';
import { SectionCard } from './SectionCard';

type Block = { title: string; body: string };

type StandardPlaceholderPageProps = {
  title: string;
  description: string;
  nav: Block;
  sections: readonly [Block, Block, Block];
  aside: Block;
  footer: Block;
};

export function StandardPlaceholderPage({
  title,
  description,
  nav,
  sections,
  aside,
  footer,
}: StandardPlaceholderPageProps) {
  return (
    <PageShell title={title} description={description}>
      <div className="grid gap-8 lg:grid-cols-[1fr_17.5rem] lg:items-start xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <SectionCard title={nav.title}>
            <p>{nav.body}</p>
          </SectionCard>
          {sections.map((s) => (
            <SectionCard key={s.title} title={s.title}>
              <p>{s.body}</p>
            </SectionCard>
          ))}
          <SectionCard title={footer.title}>
            <p>{footer.body}</p>
          </SectionCard>
        </div>
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-8">
          <SectionCard title={aside.title}>
            <p>{aside.body}</p>
          </SectionCard>
        </aside>
      </div>
    </PageShell>
  );
}

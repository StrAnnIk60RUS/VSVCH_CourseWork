import { Link } from 'react-router-dom';

export type UpNavLink = { to: string; label: string };

type NavigationUpProps = {
  links: UpNavLink[];
};

/** Кнопки-ссылки на уровни выше по структуре сайта (родительские разделы). */
export function NavigationUp({ links }: NavigationUpProps) {
  if (links.length === 0) return null;
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Навигация на уровень выше">
      {links.map((link) => (
        <Link
          key={`${link.to}-${link.label}`}
          to={link.to}
          className="inline-flex items-center rounded border border-slate-300 bg-ui-surface px-3 py-1.5 text-sm text-brand-700 shadow-sm hover:bg-slate-50"
        >
          ← {link.label}
        </Link>
      ))}
    </nav>
  );
}

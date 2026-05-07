import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';

export type UpNavLink = { to: string; label: string };

type NavigationUpProps = {
  links: UpNavLink[];
};

/** Кнопки-ссылки на уровни выше по структуре сайта (родительские разделы). */
export function NavigationUp({ links }: NavigationUpProps) {
  const t = useI18n();
  if (links.length === 0) return null;
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label={t.nav.up}>
      {links.map((link) => (
        <Link
          key={`${link.to}-${link.label}`}
          to={link.to}
          className="ui-btn-secondary group text-sm text-ui-link"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownContentProps = {
  content: string;
  className?: string;
};

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-ui-link hover:underline">
      {children}
    </a>
  ),
};

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const trimmed = content.trim();
  if (!trimmed) {
    return null;
  }

  return (
    <div className={`markdown-content text-sm text-ui-text ${className}`.trim()}>
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </Markdown>
    </div>
  );
}

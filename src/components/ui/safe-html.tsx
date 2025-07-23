import { sanitizeHtml } from '../../lib/sanitize';
import { cn } from '../../lib/utils';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitizedHtml = sanitizeHtml(html);

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:text-gray-900 prose-headings:font-semibold',
        'prose-p:text-gray-700 prose-p:leading-relaxed',
        'prose-strong:text-gray-900 prose-strong:font-semibold',
        'prose-em:text-gray-700 prose-em:italic',
        'prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md',
        'prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:pl-4 prose-blockquote:py-2',
        'prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700',
        'prose-a:text-primary-600 prose-a:hover:text-primary-700 prose-a:underline',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
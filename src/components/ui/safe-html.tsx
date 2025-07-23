import { useRef } from 'react';

import { sanitizeHtml } from '../../lib/sanitize';
import { cn } from '../../lib/utils';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sanitizedHtml = sanitizeHtml(html);

  // No need for link processing since links are not supported

  return (
    <>
      <div
        ref={contentRef}
        className={cn(
          'prose prose-sm max-w-none',
          // Typography styles - match Quill editor exactly
          'prose-headings:text-foreground prose-headings:font-semibold',
          'prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-3',
          // Text formatting
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-em:text-foreground prose-em:italic',
          '[&_b]:text-foreground [&_b]:font-semibold',
          '[&_i]:text-foreground [&_i]:italic',
          '[&_u]:underline [&_u]:text-foreground',
          '[&_s]:line-through [&_s]:text-muted-foreground',
          // Spacing
          '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          // Custom class for specific styling
          'safe-html-content',
          className,
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      
      {/* Match Quill editor styling exactly */}
      <style>{`
        .safe-html-content blockquote {
          border-left: 4px solid var(--color-primary-600) !important;
          background-color: var(--color-primary-50) !important;
          padding: 12px 16px !important;
          margin: 8px 0 !important;
          border-radius: 0 6px 6px 0 !important;
          font-style: italic !important;
        }
        
        .safe-html-content h1 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.2 !important;
        }
        
        .safe-html-content h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.3 !important;
        }
        
        .safe-html-content h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.4 !important;
        }
        
        .safe-html-content p {
          margin: 0.5rem 0 !important;
          line-height: 1.6 !important;
        }
        
        .safe-html-content ul, 
        .safe-html-content ol {
          margin: 0.5rem 0 !important;
          padding-left: 1.5rem !important;
        }
        
        .safe-html-content li {
          margin: 0.25rem 0 !important;
          line-height: 1.6 !important;
        }
      `}</style>
    </>
  );
}
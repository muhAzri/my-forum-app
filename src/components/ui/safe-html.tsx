import { useEffect, useRef } from 'react';

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
          'prose-headings:text-gray-900 prose-headings:font-semibold',
          'prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3',
          // Text formatting
          'prose-strong:text-gray-900 prose-strong:font-semibold',
          'prose-em:text-gray-700 prose-em:italic',
          '[&_b]:text-gray-900 [&_b]:font-semibold',
          '[&_i]:text-gray-700 [&_i]:italic',
          '[&_u]:underline [&_u]:text-gray-700',
          '[&_s]:line-through [&_s]:text-gray-600',
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
          border-left: 4px solid #3b82f6 !important;
          background-color: #eff6ff !important;
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
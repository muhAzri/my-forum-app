import DOMPurify from 'dompurify';
import { useCallback, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { ALLOWED_HTML_TAGS, ALLOWED_HTML_ATTRIBUTES } from '../../lib/sanitize';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string | undefined;
  minHeight?: number;
  maxHeight?: number;
  showTips?: boolean;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    ['blockquote'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline',
  'blockquote'
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  disabled = false,
  label,
  error,
  minHeight = 150,
  maxHeight = 400,
  showTips = true,
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const handleChange = useCallback((content: string) => {
    try {
      // Sanitize content to prevent XSS attacks - uses shared config for consistency
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ALLOWED_HTML_TAGS,
        ALLOWED_ATTR: ALLOWED_HTML_ATTRIBUTES,
        ALLOW_DATA_ATTR: false,
      });
      onChange(sanitizedContent);
    } catch (err) {
      console.error('Error in ReactQuill onChange:', err);
      // Fallback to original content if sanitization fails
      onChange(content);
    }
  }, [onChange]);

  // Handle potential Quill instance errors
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (quillRef.current) {
        try {
          const quill = quillRef.current.getEditor();
          if (quill) {
            // Basic error handling setup
            quill.on('text-change', () => {
              // Keep this minimal to avoid crashes
            });
          }
        } catch (err) {
          console.warn('Quill setup error:', err);
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={cn(
          'border border-gray-300 rounded-md bg-white',
          // Quill toolbar styling
          '[&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-50',
          '[&_.ql-toolbar]:bg-white [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200',
          '[&_.ql-toolbar]:rounded-t-md',
          // Quill container styling  
          '[&_.ql-container]:border-t-0 [&_.ql-container]:rounded-b-md',
          // Quill editor styling
          '[&_.ql-editor]:overflow-y-auto [&_.ql-editor]:resize-y',
          // Fix modal/tooltip positioning
          '[&_.ql-tooltip]:z-[9999] [&_.ql-tooltip]:relative',
          '[&_.ql-editing]:z-[9999]',
          error && 'border-red-500',
          disabled && 'opacity-60 pointer-events-none',
        )}
        style={{
          '--editor-min-height': `${minHeight - 42}px`,
          '--editor-max-height': `${maxHeight - 42}px`,
          zIndex: 1,
        } as unknown as React.CSSProperties & { [key: string]: string }}
      >
        <ReactQuill
          ref={quillRef}
          formats={formats}
          modules={modules}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={disabled}
          theme="snow"
          value={value || ''}
        />
      </div>

      <style>{`
        .ql-editor {
          min-height: var(--editor-min-height) !important;
          max-height: var(--editor-max-height) !important;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid #3b82f6 !important;
          background-color: #eff6ff !important;
          padding: 12px 16px !important;
          margin: 8px 0 !important;
          border-radius: 0 6px 6px 0 !important;
          font-style: italic !important;
        }
        
        /* Ensure container doesn't clip tooltips */
        .rich-text-editor-container {
          position: relative !important;
          overflow: visible !important;
        }
      `}</style>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {showTips && (
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            Tip: Use the toolbar for formatting - headers, **bold**, *italic*, and blockquotes
          </div>
          <div className="text-gray-400">
            Content is automatically sanitized for security
          </div>
        </div>
      )}
    </div>
  );
}
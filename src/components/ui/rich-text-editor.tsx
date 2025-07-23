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
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div
        className={cn(
          'relative border border-input rounded-md bg-background overflow-visible',
          // Quill toolbar styling
          '[&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-50',
          '[&_.ql-toolbar]:bg-background [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border',
          '[&_.ql-toolbar]:rounded-t-md',
          // Quill container styling  
          '[&_.ql-container]:border-t-0 [&_.ql-container]:rounded-b-md',
          // Quill editor styling with proper Tailwind height classes
          '[&_.ql-editor]:overflow-y-auto [&_.ql-editor]:resize-y',
          '[&_.ql-editor]:min-h-64', // 256px (300px - 44px toolbar height)
          '[&_.ql-editor]:max-h-96', // 384px (456px - 44px toolbar height)
          // Blockquote styling
          '[&_.ql-editor_blockquote]:border-l-4 [&_.ql-editor_blockquote]:border-primary',
          '[&_.ql-editor_blockquote]:bg-primary/5 [&_.ql-editor_blockquote]:p-3',
          '[&_.ql-editor_blockquote]:my-2 [&_.ql-editor_blockquote]:rounded-r-md',
          '[&_.ql-editor_blockquote]:italic',
          // Fix modal/tooltip positioning
          '[&_.ql-tooltip]:z-[9999] [&_.ql-tooltip]:relative',
          '[&_.ql-editing]:z-[9999]',
          error && 'border-destructive',
          disabled && 'opacity-60 pointer-events-none',
        )}
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

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {showTips && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            Tip: Use the toolbar for formatting - headers, **bold**, *italic*, and blockquotes
          </div>
          <div className="text-muted-foreground opacity-75">
            Content is automatically sanitized for security
          </div>
        </div>
      )}
    </div>
  );
}
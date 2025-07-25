import DOMPurify from 'dompurify';
import { useCallback, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { ALLOWED_HTML_TAGS, ALLOWED_HTML_ATTRIBUTES } from '../../utils/sanitize';
import { cn } from '../../utils/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (_value: string) => void;
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
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    ['blockquote'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'bold', 'italic', 'underline',
  'blockquote',
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
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ALLOWED_HTML_TAGS,
        ALLOWED_ATTR: ALLOWED_HTML_ATTRIBUTES,
        ALLOW_DATA_ATTR: false,
      });
      onChange(sanitizedContent);
    } catch {
      onChange(content);
    }
  }, [onChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        if (quill) {
          quill.on('text-change', () => {});
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
          '[&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-50',
          '[&_.ql-toolbar]:bg-background [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border',
          '[&_.ql-toolbar]:rounded-t-md',
          '[&_.ql-container]:border-t-0 [&_.ql-container]:rounded-b-md',
          '[&_.ql-editor]:overflow-y-auto [&_.ql-editor]:resize-y',
          '[&_.ql-editor]:min-h-64',
          '[&_.ql-editor]:max-h-96',
          '[&_.ql-editor_blockquote]:border-l-4 [&_.ql-editor_blockquote]:border-primary',
          '[&_.ql-editor_blockquote]:bg-primary/5 [&_.ql-editor_blockquote]:p-3',
          '[&_.ql-editor_blockquote]:my-2 [&_.ql-editor_blockquote]:rounded-r-md',
          '[&_.ql-editor_blockquote]:italic',
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

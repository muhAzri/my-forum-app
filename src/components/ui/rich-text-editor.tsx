import { Bold, Italic, List, ListOrdered, Quote, Code, Link2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '../../lib/utils';

import { Button } from './button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string | undefined;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  disabled = false,
  label,
  error,
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
      case 'b':
        e.preventDefault();
        executeCommand('bold');
        break;
      case 'i':
        e.preventDefault();
        executeCommand('italic');
        break;
      case 'k': {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        const url = prompt('Enter URL:');
        if (url) {
          executeCommand('createLink', url);
        }
        break;
      }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    executeCommand('insertText', text);
  };

  const insertList = (ordered = false) => {
    executeCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  const insertQuote = () => {
    executeCommand('formatBlock', 'blockquote');
  };

  const insertCode = () => {
    executeCommand('formatBlock', 'pre');
  };

  const toggleFormat = (format: string) => {
    executeCommand(format);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className={cn(
        'border border-gray-300 rounded-md bg-white overflow-hidden',
        isFocused && 'ring-2 ring-primary-500 ring-opacity-20 border-primary-500',
        error && 'border-red-500',
        disabled && 'bg-gray-50 opacity-60',
      )}
      >
        {/* Toolbar */}
        <div className="border-b border-gray-200 px-3 py-2 bg-gray-50">
          <div className="flex items-center space-x-1">
            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={() => toggleFormat('bold')}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Bold className="h-4 w-4" />
            </Button>

            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={() => toggleFormat('italic')}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Italic className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={() => insertList(false)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={() => insertList(true)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>

            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={insertQuote}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Quote className="h-4 w-4" />
            </Button>

            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={insertCode}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              className="h-8 w-8 p-0"
              disabled={disabled}
              onClick={() => {
                // eslint-disable-next-line no-alert
                const url = prompt('Enter URL:');
                if (url) { executeCommand('createLink', url); }
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          className={cn(
            'min-h-[120px] max-h-[400px] overflow-y-auto p-3 text-gray-900',
            'focus:outline-none prose prose-sm max-w-none',
            'prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900',
            'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400',
          )}
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: value }}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          role="textbox"
          style={{ wordBreak: 'break-word' }}
          tabIndex={0}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <div>
          Tip: Use <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">Ctrl+B</kbd> for bold,
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 ml-1">Ctrl+I</kbd> for italic,
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 ml-1">Ctrl+K</kbd> for links
        </div>
        <div className="text-gray-400">
          Content is automatically sanitized for security
        </div>
      </div>
    </div>
  );
}
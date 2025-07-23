import DOMPurify from 'dompurify';

export const ALLOWED_HTML_TAGS = [
  'div', 'p', 'br', 'span', 'strong', 'em', 'b', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote',
];

export const ALLOWED_HTML_ATTRIBUTES = [];

const sanitizeConfig = {
  ALLOWED_TAGS: ALLOWED_HTML_TAGS,
  ALLOWED_ATTR: ALLOWED_HTML_ATTRIBUTES,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input'],
  FORBID_ATTR: ['style', 'onclick', 'onerror', 'onload', 'onmouseover'],
};

export function sanitizeHtml(dirty: string): string {
  if (!dirty) { return ''; }

  return DOMPurify.sanitize(dirty, sanitizeConfig);
}

export function stripHtml(dirty: string): string {
  if (!dirty) { return ''; }

  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function createExcerpt(html: string, maxLength: number = 150): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) { return text; }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}
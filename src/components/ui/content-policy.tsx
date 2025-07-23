import { Shield, Info, AlertTriangle } from 'lucide-react';

export function ContentPolicy() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Content Security & Guidelines</h3>

          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Safe HTML Support:</strong> Basic formatting like bold, italic,
                lists, and links are supported.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Automatic Sanitization:</strong> All content is automatically
                cleaned to prevent security issues. Scripts, forms, and potentially
                harmful content are removed.
              </div>
            </div>

            <div className="text-xs text-blue-600 border-t border-blue-200 pt-2 mt-3">
              <strong>Allowed:</strong> Text formatting, lists, quotes, links, headings<br />
              <strong>Blocked:</strong> Scripts, forms, iframes, style attributes, event handlers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
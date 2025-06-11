import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { parseMarkdown } from '../utils/converters';
import { useTheme } from '../contexts/ThemeContext';

interface MarkdownPreviewProps {
  markdown: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  markdown,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const { theme } = useTheme();
  const initialContent =
    '<div class="text-center py-12 text-gray-500"><p>Your markdown preview will appear here...</p></div>';
  const [htmlContent, setHtmlContent] = useState<string>(initialContent);

  useEffect(() => {
    if (!markdown.trim()) {
      setHtmlContent(initialContent);
    } else {
      parseMarkdown(markdown).then((html) => setHtmlContent(html));
    }
  }, [markdown, initialContent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[600px] flex flex-col overflow-scroll"
    >
      <div className="flex-shrink-0 p-4 border-b border-github-border-light dark:border-github-border-default bg-github-bg-canvas dark:bg-github-bg-secondary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-github-text-light dark:text-github-text-primary">
              Live Preview
            </h2>
            <p className="text-sm text-github-text-light-secondary dark:text-github-text-secondary">
              See how your markdown will look
            </p>
          </div>
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 hover:bg-github-bg-canvas-inset dark:hover:bg-github-bg-tertiary rounded-lg transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-github-text-light-secondary dark:text-github-text-secondary hover:text-github-accent-primary" />
              ) : (
                <Maximize2 className="w-4 h-4 text-github-text-light-secondary dark:text-github-text-secondary hover:text-github-accent-primary" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ minHeight: '500px' }}>
        <div className="p-6">
          <div
            className={`markdown-preview ${theme}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </motion.div>
  );
};

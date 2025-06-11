import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onToggleFullscreen,
  isFullscreen = false,
  placeholder = "# Welcome to Markdown Converter!\n\nStart typing your markdown here or upload a file...\n\n## Features\n\n- **Real-time preview**\n- Export to PDF, DOCX, HTML, RTF, and plain text\n- Beautiful GitHub-inspired design\n- Dark/Light mode support\n\n### Example Code Block\n\n```javascript\nconst greeting = 'Hello, World!';\nconsole.log(greeting);\n```\n\n> This is a blockquote example\n\n- List item 1\n- List item 2\n- List item 3\n\n[Visit GitHub](https://github.com)",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex-shrink-0 p-4 border-b border-github-border-light dark:border-github-border-default bg-github-bg-canvas dark:bg-github-bg-secondary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-github-text-light dark:text-github-text-primary">
              Markdown Editor
            </h2>
            <p className="text-sm text-github-text-light-secondary dark:text-github-text-secondary">
              Type or paste your markdown content here
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

      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full h-full p-6 resize-none border-0 outline-none
            bg-white dark:bg-github-bg-primary
            text-github-text-light dark:text-github-text-primary
            placeholder-github-text-light-secondary dark:placeholder-github-text-secondary
            font-mono text-sm leading-relaxed
            focus:ring-0
          "
          style={{
            minHeight: '500px',
          }}
        />

        {/* Line numbers overlay */}
        <div className="absolute left-0 top-0 p-6 pointer-events-none select-none">
          <div className="font-mono text-sm text-github-text-secondary dark:text-github-text-secondary leading-relaxed">
            {value.split('\n').map((_, index) => (
              <div
                key={index}
                className="text-right pr-4"
                style={{ minWidth: '2rem' }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

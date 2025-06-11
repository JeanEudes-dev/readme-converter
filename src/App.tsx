import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { MarkdownEditor } from './components/MarkdownEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { ExportControls } from './components/ExportControls';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [currentFilename, setCurrentFilename] = useState<string>('');
  const [fullscreenMode, setFullscreenMode] = useState<
    'none' | 'editor' | 'preview'
  >('none');

  // Load saved content from localStorage on mount
  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown-content');
    const savedFilename = localStorage.getItem('current-filename');

    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    if (savedFilename) {
      setCurrentFilename(savedFilename);
    }
  }, []);

  // Save content to localStorage when it changes
  useEffect(() => {
    if (markdown) {
      localStorage.setItem('markdown-content', markdown);
    }
  }, [markdown]);

  useEffect(() => {
    if (currentFilename) {
      localStorage.setItem('current-filename', currentFilename);
    }
  }, [currentFilename]);

  const handleFileSelect = (content: string, filename: string) => {
    setMarkdown(content);
    setCurrentFilename(filename);
  };

  const handleClear = () => {
    setMarkdown('');
    setCurrentFilename('');
    localStorage.removeItem('markdown-content');
    localStorage.removeItem('current-filename');
  };

  const toggleEditorFullscreen = () => {
    setFullscreenMode(fullscreenMode === 'editor' ? 'none' : 'editor');
  };

  const togglePreviewFullscreen = () => {
    setFullscreenMode(fullscreenMode === 'preview' ? 'none' : 'preview');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-github-bg-primary transition-colors duration-200">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* File Upload Section */}
            <section>
              <FileUpload
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                currentFile={currentFilename}
              />
            </section>

            {/* Export Controls Bar */}
            <section>
              <motion.div
                className="bg-white dark:bg-github-bg-secondary rounded-xl shadow-lg border border-github-border-light dark:border-github-border-default p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ExportControls
                  markdown={markdown}
                  filename={currentFilename || 'document'}
                  isCompact={true}
                />
              </motion.div>
            </section>

            {/* Main Content Grid - Editor and Preview */}
            <section
              className={`grid gap-8 ${
                fullscreenMode === 'editor' || fullscreenMode === 'preview'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 lg:grid-cols-2'
              }`}
            >
              {/* Editor Panel */}
              <div className={fullscreenMode === 'preview' ? 'hidden' : ''}>
                <motion.div
                  className="bg-white dark:bg-github-bg-secondary rounded-xl shadow-lg border border-github-border-light dark:border-github-border-default overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ minHeight: '600px' }}
                >
                  <MarkdownEditor
                    value={markdown}
                    onChange={setMarkdown}
                    onToggleFullscreen={toggleEditorFullscreen}
                    isFullscreen={fullscreenMode === 'editor'}
                  />
                </motion.div>
              </div>

              {/* Preview Panel */}
              <div className={fullscreenMode === 'editor' ? 'hidden' : ''}>
                <motion.div
                  className="bg-white dark:bg-github-bg-secondary rounded-xl shadow-lg border border-github-border-light dark:border-github-border-default overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ minHeight: '600px' }}
                >
                  <MarkdownPreview
                    markdown={markdown}
                    onToggleFullscreen={togglePreviewFullscreen}
                    isFullscreen={fullscreenMode === 'preview'}
                  />
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <motion.footer
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="space-y-2">
                <p className="text-github-text-secondary dark:text-github-text-secondary text-sm">
                  Built with ❤️ by{' '}
                  <a
                    href="https://github.com/JeanEudes-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-github-accent-primary hover:text-github-accent-primary-hover font-medium"
                  >
                    Jean-Eudes ASSOGBA
                  </a>
                </p>
                <p className="text-github-text-secondary dark:text-github-text-secondary text-xs">
                  Open source • Client-side only • No data collection
                </p>
              </div>
            </motion.footer>
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;

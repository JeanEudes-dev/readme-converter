import { motion } from 'framer-motion';
import { Sun, Moon, Github, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-github-bg-primary border-b border-github-border-light dark:border-github-border-default"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 bg-github-accent-primary rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-6 h-6 text-github-text-inverse" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-github-text-light dark:text-github-text-primary">
                Markdown Converter
              </h1>
              <p className="text-sm text-github-text-light-secondary dark:text-github-text-secondary">
                Convert markdown to any format
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* GitHub Link */}
            <motion.a
              href="https://github.com/JeanEudes-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-github-text-light-secondary dark:text-github-text-secondary hover:text-github-accent-primary dark:hover:text-github-accent-primary transition-colors rounded-lg hover:bg-github-bg-canvas-inset dark:hover:bg-github-bg-secondary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-github-text-light-secondary dark:text-github-text-secondary hover:text-github-accent-primary dark:hover:text-github-accent-primary transition-colors rounded-lg hover:bg-github-bg-canvas-inset dark:hover:bg-github-bg-secondary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

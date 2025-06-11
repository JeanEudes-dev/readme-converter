import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isMarkdownFile } from '../utils/converters';

interface FileUploadProps {
  onFileSelect: (content: string, filename: string) => void;
  onClear: () => void;
  currentFile?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onClear,
  currentFile,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        setError('Please select a valid Markdown file (.md, .markdown, .txt)');
        return;
      }

      const file = acceptedFiles[0];

      if (!isMarkdownFile(file)) {
        setError('Please select a valid Markdown file (.md, .markdown, .txt)');
        return;
      }

      try {
        const content = await file.text();
        onFileSelect(content, file.name);
      } catch (err) {
        setError('Failed to read file. Please try again.');
        console.error('File read error:', err);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'text/markdown': ['.md', '.markdown'],
        'text/plain': ['.txt'],
      },
      multiple: false,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
    });

  const getBorderColor = () => {
    if (isDragReject)
      return 'border-github-accent-warning bg-red-50 dark:bg-red-900/10';
    if (isDragAccept || isDragActive)
      return 'border-github-accent-primary bg-blue-50 dark:bg-blue-900/10';
    return 'border-github-border-light dark:border-github-border-default hover:border-github-accent-primary';
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'scale-105' : 'hover:scale-102'}
        `}
      >
        <input {...getInputProps()} />

        <motion.div
          className="text-center space-y-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="flex justify-center"
            animate={{
              y: isDragActive ? -5 : 0,
              rotate: isDragActive ? 5 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Upload
              className={`
              w-12 h-12 transition-colors duration-300
              ${isDragActive ? 'text-github-accent-primary' : 'text-github-text-light-secondary dark:text-github-text-secondary'}
            `}
            />
          </motion.div>

          <div>
            <h3 className="text-lg font-semibold text-github-text-light dark:text-github-text-primary mb-2">
              {isDragActive
                ? 'Drop your file here'
                : 'Drop your Markdown file here'}
            </h3>
            <p className="text-github-text-light-secondary dark:text-github-text-secondary">
              or{' '}
              <span className="text-github-accent-primary hover:text-github-accent-primary-hover font-medium">
                click to browse
              </span>
            </p>
          </div>

          <div className="text-xs text-github-text-light-secondary dark:text-github-text-secondary">
            Supports .md, .markdown, and .txt files
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-github-bg-canvas dark:bg-github-bg-tertiary rounded-lg border border-github-border-default"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-github-accent-primary" />
              <div>
                <p className="font-medium text-github-text-light dark:text-github-text-primary">
                  {currentFile}
                </p>
                <p className="text-sm text-github-text-secondary dark:text-github-text-secondary">
                  File loaded successfully
                </p>
              </div>
            </div>

            <motion.button
              onClick={onClear}
              className="p-2 hover:bg-github-bg-secondary dark:hover:bg-github-bg-secondary rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-github-text-secondary hover:text-github-text-light" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

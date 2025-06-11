import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  File,
  Code,
  Type,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  convertToPDF,
  convertToDOCX,
  convertToHTML,
  convertToText,
  convertToRTF,
  parseMarkdown,
} from '../utils/converters';

interface ExportControlsProps {
  markdown: string;
  filename?: string;
  isCompact?: boolean;
}

type ExportFormat = 'pdf' | 'docx' | 'html' | 'txt' | 'rtf';

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const exportOptions: ExportOption[] = [
  {
    format: 'pdf',
    label: 'PDF',
    description: 'Portable Document Format',
    icon: FileText,
    color: 'text-red-600 dark:text-red-400',
  },
  {
    format: 'docx',
    label: 'Word',
    description: 'Microsoft Word Document',
    icon: File,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    format: 'html',
    label: 'HTML',
    description: 'Web Page Format',
    icon: Code,
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    format: 'txt',
    label: 'Text',
    description: 'Plain Text File',
    icon: Type,
    color: 'text-gray-600 dark:text-gray-400',
  },
  {
    format: 'rtf',
    label: 'RTF',
    description: 'Rich Text Format',
    icon: FileText,
    color: 'text-purple-600 dark:text-purple-400',
  },
];

export const ExportControls: React.FC<ExportControlsProps> = ({
  markdown,
  filename = 'document',
  isCompact = false,
}) => {
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);
  const [lastExported, setLastExported] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCleanFilename = (format: ExportFormat): string => {
    const cleanName = filename.replace(/\.[^/.]+$/, ''); // Remove existing extension
    return `${cleanName}.${format}`;
  };

  const handleExport = async (format: ExportFormat) => {
    if (!markdown.trim()) {
      setError('Please enter some markdown content before exporting');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoadingFormat(format);
    setError(null);

    try {
      const exportFilename = getCleanFilename(format);

      switch (format) {
        case 'pdf': {
          const htmlContent = await parseMarkdown(markdown);
          await convertToPDF(htmlContent, exportFilename);
          break;
        }
        case 'docx':
          await convertToDOCX(markdown, exportFilename);
          break;
        case 'html': {
          const html = await parseMarkdown(markdown);
          convertToHTML(html, exportFilename);
          break;
        }
        case 'txt':
          convertToText(markdown, exportFilename);
          break;
        case 'rtf':
          convertToRTF(markdown, exportFilename);
          break;
      }

      setLastExported(format);
      setTimeout(() => setLastExported(null), 2000);
    } catch (err) {
      console.error(`Export error (${format}):`, err);
      setError(
        `Failed to export as ${format.toUpperCase()}. Please try again.`
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoadingFormat(null);
    }
  };

  const getButtonState = (format: ExportFormat) => {
    if (loadingFormat === format) return 'loading';
    if (lastExported === format) return 'success';
    return 'default';
  };

  const getButtonIcon = (option: ExportOption) => {
    const state = getButtonState(option.format);

    if (state === 'loading') {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }

    if (state === 'success') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }

    const IconComponent = option.icon;
    return <IconComponent className={`w-5 h-5 ${option.color}`} />;
  };

  const getButtonColors = (format: ExportFormat) => {
    const state = getButtonState(format);

    if (state === 'loading') {
      return 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed';
    }

    if (state === 'success') {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }

    return 'bg-white dark:bg-github-bg-tertiary hover:bg-gray-50 dark:hover:bg-github-bg-secondary border-github-border-default dark:border-github-border-default hover:border-github-accent-primary dark:hover:border-github-accent-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={isCompact ? 'space-y-4' : 'space-y-6'}
    >
      <div>
        <h2
          className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-github-text-light dark:text-github-text-primary mb-2 flex items-center`}
        >
          <Download
            className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'} mr-2 text-github-accent-primary`}
          />
          Export Options
        </h2>
        <p className="text-github-text-light-secondary dark:text-github-text-secondary">
          Choose your preferred format to download the converted document
        </p>
      </div>{' '}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-github-accent-warning dark:border-red-800 rounded-lg flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-github-accent-warning flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </motion.div>
      )}
      <div
        className={`grid gap-4 ${isCompact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}
      >
        {exportOptions.map((option) => (
          <motion.button
            key={option.format}
            onClick={() => handleExport(option.format)}
            disabled={loadingFormat === option.format}
            className={`
              ${isCompact ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all duration-200 text-left
              ${getButtonColors(option.format)}
              disabled:cursor-not-allowed
            `}
            whileHover={{ scale: loadingFormat === option.format ? 1 : 1.02 }}
            whileTap={{ scale: loadingFormat === option.format ? 1 : 0.98 }}
          >
            <div
              className={`flex items-center ${isCompact ? 'space-x-2' : 'space-x-3'}`}
            >
              {getButtonIcon(option)}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-github-text-light dark:text-github-text-primary ${isCompact ? 'text-sm' : ''}`}
                >
                  {option.label}
                </h3>
                {!isCompact && (
                  <p className="text-sm text-github-text-light-secondary dark:text-github-text-secondary truncate">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-github-text-secondary dark:text-github-text-secondary">
          All conversions happen locally in your browser. No data is sent to any
          server.
        </p>
      </div>
    </motion.div>
  );
};

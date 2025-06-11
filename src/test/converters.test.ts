import { describe, it, expect } from 'vitest';
import {
  parseMarkdown,
  isMarkdownFile,
  getFileExtension,
} from '../utils/converters';

describe('Converter Utils', () => {
  describe('parseMarkdown', () => {
    it('should convert markdown to HTML', () => {
      const markdown = '# Hello World\n\nThis is a **bold** text.';
      const html = parseMarkdown(markdown);

      expect(html).toContain('<h1');
      expect(html).toContain('Hello World');
      expect(html).toContain('<strong>');
      expect(html).toContain('bold');
    });

    it('should sanitize dangerous HTML', () => {
      const markdown = '# Title\n\n<script>alert("xss")</script>';
      const html = parseMarkdown(markdown);

      expect(html).not.toContain('<script>');
      expect(html).toContain('<h1');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension correctly', () => {
      expect(getFileExtension('document.md')).toBe('md');
      expect(getFileExtension('readme.markdown')).toBe('markdown');
      expect(getFileExtension('file.txt')).toBe('txt');
      expect(getFileExtension('file')).toBe('');
    });
  });

  describe('isMarkdownFile', () => {
    it('should identify markdown files correctly', () => {
      const mdFile = new File(['content'], 'test.md', {
        type: 'text/markdown',
      });
      const markdownFile = new File(['content'], 'test.markdown', {
        type: 'text/plain',
      });
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const jsFile = new File(['content'], 'test.js', {
        type: 'application/javascript',
      });

      expect(isMarkdownFile(mdFile)).toBe(true);
      expect(isMarkdownFile(markdownFile)).toBe(true);
      expect(isMarkdownFile(txtFile)).toBe(true);
      expect(isMarkdownFile(jsFile)).toBe(false);
    });
  });
});

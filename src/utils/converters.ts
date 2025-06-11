/* eslint-disable @typescript-eslint/no-explicit-any */
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Parse markdown to HTML with sanitization
 */
export const parseMarkdown = async (markdown: string): Promise<string> => {
  const html = await marked(markdown);
  return DOMPurify.sanitize(html);
};

/**
 * Convert HTML to PDF using jsPDF and html2canvas
 */
export const convertToPDF = async (
  htmlContent: string,
  filename: string = 'document.pdf'
): Promise<void> => {
  try {
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#24292f';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.className = 'markdown-preview light';

    // Temporarily add to DOM for rendering
    document.body.appendChild(tempDiv);

    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
    });

    // Remove temporary div
    document.body.removeChild(tempDiv);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error converting to PDF:', error);
    throw new Error('Failed to convert to PDF');
  }
};

/**
 * Convert markdown to DOCX using docx library
 */
export const convertToDOCX = async (
  markdown: string,
  filename: string = 'document.docx'
): Promise<void> => {
  try {
    const lines = markdown.split('\n');
    const docElements: any[] = [];

    for (const line of lines) {
      if (line.trim() === '') {
        docElements.push(new Paragraph({ text: '' }));
        continue;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        docElements.push(
          new Paragraph({
            text: line.replace('# ', ''),
            heading: HeadingLevel.HEADING_1,
          })
        );
      } else if (line.startsWith('## ')) {
        docElements.push(
          new Paragraph({
            text: line.replace('## ', ''),
            heading: HeadingLevel.HEADING_2,
          })
        );
      } else if (line.startsWith('### ')) {
        docElements.push(
          new Paragraph({
            text: line.replace('### ', ''),
            heading: HeadingLevel.HEADING_3,
          })
        );
      } else if (line.startsWith('#### ')) {
        docElements.push(
          new Paragraph({
            text: line.replace('#### ', ''),
            heading: HeadingLevel.HEADING_4,
          })
        );
      } else {
        // Regular paragraph - handle basic formatting
        const runs: TextRun[] = [];
        const currentText = line;

        // Simple bold formatting
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = currentText.split(boldRegex);

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            // Regular text
            if (parts[i]) {
              runs.push(new TextRun({ text: parts[i] }));
            }
          } else {
            // Bold text
            runs.push(new TextRun({ text: parts[i], bold: true }));
          }
        }

        if (runs.length === 0) {
          runs.push(new TextRun({ text: currentText }));
        }

        docElements.push(new Paragraph({ children: runs }));
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docElements,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error converting to DOCX:', error);
    throw new Error('Failed to convert to DOCX');
  }
};

/**
 * Convert to HTML file
 */
export const convertToHTML = (
  htmlContent: string,
  filename: string = 'document.html'
): void => {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #24292f;
        }
        h1, h2 { border-bottom: 1px solid #d0d7de; padding-bottom: 8px; }
        code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        blockquote { border-left: 4px solid #d0d7de; padding-left: 16px; color: #656d76; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #d0d7de; padding: 8px 12px; text-align: left; }
        th { background: #f6f8fa; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

  const blob = new Blob([htmlTemplate], { type: 'text/html' });
  saveAs(blob, filename);
};

/**
 * Convert to plain text
 */
export const convertToText = (
  markdown: string,
  filename: string = 'document.txt'
): void => {
  // Remove markdown formatting for plain text
  const text = markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
    .replace(/^\s*[-*+]\s+/gm, '• ') // Convert lists to bullet points
    .replace(/^\s*\d+\.\s+/gm, '• '); // Convert numbered lists to bullet points

  const blob = new Blob([text], { type: 'text/plain' });
  saveAs(blob, filename);
};

/**
 * Convert to RTF
 */
export const convertToRTF = (
  markdown: string,
  filename: string = 'document.rtf'
): void => {
  // Basic RTF conversion
  let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';

  const lines = markdown.split('\n');

  for (const line of lines) {
    if (line.trim() === '') {
      rtf += '\\par ';
      continue;
    }

    if (line.startsWith('# ')) {
      rtf += `\\par \\b \\fs28 ${line.replace('# ', '')}\\b0 \\fs24 \\par `;
    } else if (line.startsWith('## ')) {
      rtf += `\\par \\b \\fs26 ${line.replace('## ', '')}\\b0 \\fs24 \\par `;
    } else if (line.startsWith('### ')) {
      rtf += `\\par \\b \\fs24 ${line.replace('### ', '')}\\b0 \\par `;
    } else {
      // Handle basic formatting
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '\\b $1\\b0 ') // Bold
        .replace(/\*(.*?)\*/g, '\\i $1\\i0 '); // Italic

      rtf += `${formattedLine}\\par `;
    }
  }

  rtf += '}';

  const blob = new Blob([rtf], { type: 'application/rtf' });
  saveAs(blob, filename);
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Validate file type
 */
export const isMarkdownFile = (file: File): boolean => {
  const validExtensions = ['md', 'markdown', 'txt'];
  const extension = getFileExtension(file.name);
  return validExtensions.includes(extension) || file.type === 'text/markdown';
};

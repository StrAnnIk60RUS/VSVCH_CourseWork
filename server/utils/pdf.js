import { existsSync } from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

export function resolvePdfFontPath() {
  const customFont = process.env.PDF_FONT_PATH;
  const candidates = [
    customFont,
    path.resolve(process.cwd(), 'server/assets/fonts/DejaVuSans.ttf'),
    'C:/Windows/Fonts/arial.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    '/Library/Fonts/Arial Unicode.ttf',
    '/Library/Fonts/Arial.ttf',
  ];
  return candidates.find((fontPath) => Boolean(fontPath) && existsSync(fontPath)) ?? null;
}

/**
 * @typedef {{
 *   variant?: 'report' | 'certificate';
 *   title: string;
 *   subtitle?: string;
 *   issuedTo?: string;
 *   badge?: string;
 *   accent?: string;
 *   meta?: string[];
 *   sections?: Array<{ heading?: string; lines: string[] }>;
 *   table?: { headers: string[]; rows: string[][] };
 *   footer?: string[];
 * }} PdfTemplate
 */

/**
 * Render a list of textual lines or structured template into a PDF buffer.
 *
 * @param {string[] | PdfTemplate} input
 * @returns {Promise<Buffer>}
 */
export function buildPdfBuffer(input) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    /** @type {Buffer[]} */
    const chunks = [];
    const fontPath = resolvePdfFontPath();
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    if (fontPath) {
      doc.font(fontPath);
    }
    doc.fillColor('#0f172a').lineGap(2);
    if (Array.isArray(input)) {
      input.forEach((line, idx) => {
        const isTitle = idx === 0;
        const isDivider = line === '';
        if (isTitle) {
          doc.fontSize(18).text(line);
          doc.moveDown(0.35);
          return;
        }
        if (isDivider) {
          doc.moveDown(0.4);
          return;
        }
        doc.fontSize(11).text(line);
        doc.moveDown(0.5);
      });
      doc.end();
      return;
    }

    const template = input;
    const variant = template.variant ?? 'report';
    const accent = template.accent ?? '#2563eb';

    if (variant === 'certificate') {
      const pageLeft = doc.page.margins.left;
      const pageTop = doc.page.margins.top;
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;

      doc.rect(pageLeft, pageTop, pageWidth, pageHeight).lineWidth(2).stroke(accent);
      doc
        .rect(pageLeft + 10, pageTop + 10, pageWidth - 20, pageHeight - 20)
        .lineWidth(0.8)
        .stroke('#94a3b8');

      doc.moveDown(1.4);
      if (template.badge) {
        doc.fontSize(11).fillColor(accent).text(template.badge, { align: 'center' });
        doc.moveDown(0.3);
      }
      doc.fontSize(28).fillColor('#0f172a').text(template.title, { align: 'center' });
      if (template.subtitle) {
        doc.moveDown(0.4);
        doc.fontSize(12).fillColor('#334155').text(template.subtitle, {
          align: 'center',
          width: pageWidth - 120,
          indent: 60,
        });
      }
      if (template.issuedTo) {
        doc.moveDown(1.1);
        doc.fontSize(12).fillColor('#475569').text('AWARDED TO', { align: 'center' });
        doc.moveDown(0.25);
        doc.fontSize(24).fillColor('#111827').text(template.issuedTo, { align: 'center' });
      }

      (template.meta ?? []).forEach((line) => {
        doc.moveDown(0.28);
        doc.fontSize(11).fillColor('#1e293b').text(line, { align: 'center' });
      });

      (template.sections ?? []).forEach((section) => {
        doc.moveDown(0.7);
        if (section.heading) {
          doc.fontSize(12.5).fillColor('#0f172a').text(section.heading, { align: 'center' });
        }
        section.lines.forEach((line) => {
          doc.moveDown(0.15);
          doc.fontSize(11).fillColor('#334155').text(line, { align: 'center' });
        });
      });

      doc.moveDown(1.2);
      const signY = doc.y;
      const firstLineX = pageLeft + 40;
      const secondLineX = pageLeft + pageWidth - 200;
      doc.moveTo(firstLineX, signY).lineTo(firstLineX + 160, signY).stroke('#94a3b8');
      doc.moveTo(secondLineX, signY).lineTo(secondLineX + 160, signY).stroke('#94a3b8');
      doc.fontSize(9.5).fillColor('#64748b').text('Program Director', firstLineX, signY + 6, { width: 160, align: 'center' });
      doc.fontSize(9.5).fillColor('#64748b').text('Authorized Signature', secondLineX, signY + 6, {
        width: 160,
        align: 'center',
      });

      (template.footer ?? []).forEach((line) => {
        doc.moveDown(0.45);
        doc.fontSize(9.5).fillColor('#475569').text(line, { align: 'center' });
      });

      doc.end();
      return;
    }

    doc.fontSize(9).fillColor(accent).text('VSVH REPORT', { align: 'right' });
    doc.moveDown(0.15);
    doc.fontSize(22).fillColor('#111827').text(template.title, { align: 'left' });
    if (template.subtitle) {
      doc.moveDown(0.2);
      doc.fontSize(11).fillColor('#475569').text(template.subtitle);
    }
    doc.moveDown(0.55);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cbd5e1');
    doc.moveDown(0.65);

    (template.meta ?? []).forEach((line) => {
      doc.fontSize(10.8).fillColor('#1f2937').text(line);
      doc.moveDown(0.1);
    });

    (template.sections ?? []).forEach((section) => {
      doc.moveDown(0.5);
      if (section.heading) {
        doc.fontSize(12.5).fillColor('#0f172a').text(section.heading);
        doc.moveDown(0.2);
      }
      section.lines.forEach((line) => {
        doc.fontSize(10.2).fillColor('#334155').text(`• ${line}`);
        doc.moveDown(0.12);
      });
    });

    if (template.table && template.table.headers.length > 0) {
      const { headers, rows } = template.table;
      const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const colWidth = availableWidth / headers.length;
      const startX = doc.page.margins.left;
      let y = doc.y + 10;

      const getRowHeight = (cells, isHeader = false) => {
        const fontSize = isHeader ? 10.5 : 9.5;
        const maxCellTextHeight = cells.reduce((maxHeight, cell) => {
          doc.fontSize(fontSize);
          const textHeight = doc.heightOfString(String(cell ?? ''), {
            width: colWidth - 8,
            ellipsis: true,
          });
          return Math.max(maxHeight, textHeight);
        }, 0);
        const paddedHeight = Math.ceil(maxCellTextHeight) + 10;
        return Math.max(20, Math.min(paddedHeight, 64));
      };

      const renderRow = (cells, isHeader = false, rowIndex = 0) => {
        const rowHeight = getRowHeight(cells, isHeader);
        cells.forEach((cell, idx) => {
          const x = startX + idx * colWidth;
          if (isHeader) {
            doc.rect(x, y, colWidth, rowHeight).fillAndStroke('#e2e8f0', '#cbd5e1');
          } else if (rowIndex % 2 === 1) {
            doc.rect(x, y, colWidth, rowHeight).fillAndStroke('#f8fafc', '#e2e8f0');
          } else {
            doc.rect(x, y, colWidth, rowHeight).stroke('#e2e8f0');
          }
          doc
            .fontSize(isHeader ? 10.5 : 9.5)
            .fillColor(isHeader ? '#0f172a' : '#334155')
            .text(String(cell ?? ''), x + 4, y + 5, {
              width: colWidth - 8,
              height: rowHeight - 8,
              ellipsis: true,
            });
        });
        y += rowHeight;
      };

      renderRow(headers, true);
      rows.slice(0, 35).forEach((row, rowIndex) => renderRow(row, false, rowIndex));
      doc.y = y;
    }

    (template.footer ?? []).forEach((line) => {
      doc.moveDown(0.4);
      doc.fontSize(9.5).fillColor('#64748b').text(line);
    });
    doc.end();
  });
}

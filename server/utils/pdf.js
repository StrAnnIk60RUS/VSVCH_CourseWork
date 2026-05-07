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
 * Render a list of textual lines into a PDF buffer.
 * The first non-empty line is rendered as a title; empty strings act as vertical dividers.
 *
 * @param {string[]} lines
 * @returns {Promise<Buffer>}
 */
export function buildPdfBuffer(lines) {
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
    lines.forEach((line, idx) => {
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
  });
}

import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { createLogger } from '../../utils/logger';

const log = createLogger('ExportService');

interface ExportQuestion {
  question_text: string;
  question_index: number;
  section?: string | null;
  answer_text: string | null;
  answer_status: string;
  confidence: number;
}

export type ExportFormat = 'xlsx' | 'pdf' | 'docx' | 'md';

/**
 * Generates questionnaire result exports in multiple formats.
 */
export class ExportService {

  /**
   * Exports questionnaire Q&A pairs in the specified format.
   * Returns { buffer, contentType, extension }.
   */
  async exportQuestionnaire(
    questions: ExportQuestion[],
    format: ExportFormat,
    questionnaireName: string
  ): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
    switch (format) {
      case 'xlsx':
        return this.exportXlsx(questions, questionnaireName);
      case 'pdf':
        return this.exportPdf(questions, questionnaireName);
      case 'docx':
        return this.exportDocx(questions, questionnaireName);
      case 'md':
        return this.exportMarkdown(questions, questionnaireName);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportXlsx(questions: ExportQuestion[], title: string): { buffer: Buffer; contentType: string; extension: string } {
    const rows = questions.map(q => ({
      '#': q.question_index + 1,
      'Section': q.section || '',
      'Question': q.question_text,
      'Answer': q.answer_text || '',
      'Status': q.answer_status,
      'Confidence': q.confidence ? `${Math.round(q.confidence * 100)}%` : '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },   // #
      { wch: 20 },  // Section
      { wch: 60 },  // Question
      { wch: 80 },  // Answer
      { wch: 12 },  // Status
      { wch: 12 },  // Confidence
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Questionnaire Results');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

    return {
      buffer: buf,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
    };
  }

  private exportPdf(questions: ExportQuestion[], title: string): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType: 'application/pdf',
          extension: 'pdf',
        });
      });
      doc.on('error', reject);

      // Title
      doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#666666')
        .text(`Generated: ${new Date().toLocaleDateString()} | ${questions.length} questions`, { align: 'center' });
      doc.moveDown(1);

      let currentSection = '';

      for (const q of questions) {
        // Section header
        if (q.section && q.section !== currentSection) {
          currentSection = q.section;
          doc.moveDown(0.5);
          doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a5632')
            .text(currentSection);
          doc.moveDown(0.3);
          // Separator line
          doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
          doc.moveDown(0.3);
        }

        // Question
        const confPct = q.confidence ? `${Math.round(q.confidence * 100)}%` : 'N/A';
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000')
          .text(`Q${q.question_index + 1}. ${q.question_text}`, { continued: false });
        doc.moveDown(0.2);

        // Answer
        if (q.answer_text) {
          doc.fontSize(10).font('Helvetica').fillColor('#333333')
            .text(q.answer_text, { indent: 15 });
        } else {
          doc.fontSize(10).font('Helvetica-Oblique').fillColor('#999999')
            .text('No answer generated', { indent: 15 });
        }

        // Status & confidence
        doc.moveDown(0.1);
        doc.fontSize(8).font('Helvetica').fillColor('#888888')
          .text(`Status: ${q.answer_status} | Confidence: ${confPct}`, { indent: 15 });
        doc.moveDown(0.5);

        // Check if we need a new page
        if (doc.y > 700) {
          doc.addPage();
        }
      }

      doc.end();
    });
  }

  private async exportDocx(questions: ExportQuestion[], title: string): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
    const children: Paragraph[] = [];

    // Title
    children.push(new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }));

    // Subtitle
    children.push(new Paragraph({
      children: [new TextRun({
        text: `Generated: ${new Date().toLocaleDateString()} | ${questions.length} questions`,
        size: 20,
        color: '666666',
        italics: true,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }));

    let currentSection = '';

    for (const q of questions) {
      // Section header
      if (q.section && q.section !== currentSection) {
        currentSection = q.section;
        children.push(new Paragraph({
          text: currentSection,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }));
      }

      // Question
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `Q${q.question_index + 1}. `, bold: true, size: 22 }),
          new TextRun({ text: q.question_text, bold: true, size: 22 }),
        ],
        spacing: { before: 200, after: 100 },
      }));

      // Answer
      const confPct = q.confidence ? `${Math.round(q.confidence * 100)}%` : 'N/A';
      if (q.answer_text) {
        children.push(new Paragraph({
          children: [new TextRun({ text: q.answer_text, size: 20 })],
          indent: { left: 360 },
          spacing: { after: 50 },
        }));
      } else {
        children.push(new Paragraph({
          children: [new TextRun({ text: 'No answer generated', italics: true, color: '999999', size: 20 })],
          indent: { left: 360 },
          spacing: { after: 50 },
        }));
      }

      // Status line
      children.push(new Paragraph({
        children: [new TextRun({
          text: `Status: ${q.answer_status} | Confidence: ${confPct}`,
          size: 16,
          color: '888888',
          italics: true,
        })],
        indent: { left: 360 },
        spacing: { after: 200 },
      }));
    }

    const doc = new Document({
      sections: [{ children }],
    });

    const buf = await Packer.toBuffer(doc);

    return {
      buffer: Buffer.from(buf),
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: 'docx',
    };
  }

  private exportMarkdown(questions: ExportQuestion[], title: string): { buffer: Buffer; contentType: string; extension: string } {
    const lines: string[] = [];

    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`> Generated: ${new Date().toLocaleDateString()} | ${questions.length} questions`);
    lines.push('');
    lines.push('---');
    lines.push('');

    let currentSection = '';

    for (const q of questions) {
      if (q.section && q.section !== currentSection) {
        currentSection = q.section;
        lines.push(`## ${currentSection}`);
        lines.push('');
      }

      const confPct = q.confidence ? `${Math.round(q.confidence * 100)}%` : 'N/A';
      lines.push(`### Q${q.question_index + 1}. ${q.question_text}`);
      lines.push('');

      if (q.answer_text) {
        lines.push(q.answer_text);
      } else {
        lines.push('*No answer generated*');
      }
      lines.push('');
      lines.push(`> Status: ${q.answer_status} | Confidence: ${confPct}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    const content = lines.join('\n');

    return {
      buffer: Buffer.from(content, 'utf-8'),
      contentType: 'text/markdown',
      extension: 'md',
    };
  }
}

export const exportService = new ExportService();

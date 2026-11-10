import { createClient } from '@/utils/supabase/client';
import { pdf } from '@react-pdf/renderer';
import {
  buildExamPdfData,
  createExamPdfDocument,
  fetchExamForPdf,
  getExamPdfFilename,
} from './examPdf';

export async function generatePdf(examId: string) {
  const data = await fetchExamForPdf(createClient(), examId);
  if (!data) throw new Error('Exame não encontrado.');

  const blob = await pdf(createExamPdfDocument(buildExamPdfData(data))).toBlob();
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = getExamPdfFilename(data);
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

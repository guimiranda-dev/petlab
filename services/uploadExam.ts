import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { renderToBuffer } from '@react-pdf/renderer';
import { DateTime } from 'luxon';
import { ExamUploadTimings } from './examUploadTimings';
import { ExamInterface } from '@/types/exam';
import { buildExamPdfData, createExamPdfDocument, getExamPdfFilename } from './examPdf';

const UPLOAD_URL =
  'https://almanaque-chat-ai-870579198997.us-central1.run.app/integrations/simplesvet/exames';

export class ExamUploadError extends Error {
  constructor(
    message: string,
    public status: number,
    public upstream?: { status: number; requestId?: string },
  ) {
    super(message);
  }
}

export async function uploadExam(
  exam: ExamInterface,
  token: string,
  timings = new ExamUploadTimings(),
) {
  const animalCode = String(exam.pet?.external_id ?? '').trim();
  if (!/^\d+$/.test(animalCode) || !/[1-9]/.test(animalCode)) {
    throw new ExamUploadError(
      'Cadastre um código externo válido para o animal antes de enviar.',
      422,
    );
  }

  // Preserva o dia cadastrado, inclusive quando a data contém um offset de fuso horário.
  const examDate = DateTime.fromISO(exam.date, { setZone: true }).toISODate();
  if (!examDate) throw new ExamUploadError('A data do exame é inválida.', 422);

  const form = await timings.measure('geracao_pdf', async () => {
    const values = buildExamPdfData(exam);
    async function imageDataUrl(filename: string) {
      const bytes = await readFile(path.join(process.cwd(), 'public', 'assets', filename));
      return `data:image/png;base64,${bytes.toString('base64')}`;
    }
    const [header, logo, signature] = await Promise.all([
      imageDataUrl('pdf-header.png'),
      imageDataUrl('mini-logo-pdf.png'),
      imageDataUrl('signature.png'),
    ]);
    const buffer = await renderToBuffer(createExamPdfDocument(values, { header, logo, signature }));
    const form = new FormData();
    form.append(
      'file',
      new Blob([new Uint8Array(buffer)], { type: 'application/pdf' }),
      getExamPdfFilename(exam),
    );
    form.append('codigoAnimal', animalCode);
    form.append('tipoExame', exam.exam_type);
    form.append('laboratorio', 'Petlab');
    form.append('dataExame', examDate);

    return form;
  });

  await timings.measure('integracao', async () => {
    let response: Response;
    try {
      response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Idempotency-Key': `petlab-exame-${exam.id}`,
        },
        body: form,
        signal: AbortSignal.timeout(60000),
        redirect: 'error',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new ExamUploadError(
          'O envio demorou demais. Tente novamente para consultar ou concluir o envio.',
          504,
        );
      }
      throw new ExamUploadError(
        'Não foi possível conectar ao serviço de envio. Tente novamente.',
        502,
      );
    }

    if (!response.ok) {
      const requestId =
        response.headers.get('x-request-id') ??
        response.headers.get('x-cloud-trace-context') ??
        undefined;
      let responseBody: string;
      try {
        responseBody = (await response.text())
          .split(token)
          .join('[REDACTED]')
          .replace(/Bearer\s+[^\s"'<>]+/gi, 'Bearer [REDACTED]')
          .slice(0, 4096);
      } catch {
        responseBody = '[Não foi possível ler a resposta do serviço]';
      }
      console.error('[exam-upload:resposta_integracao]', {
        examId: exam.id,
        status: response.status,
        requestId,
        responseBody,
      });
      const rejected = (message: string, status: number) =>
        new ExamUploadError(message, status, { status: response.status, requestId });
      switch (response.status) {
        case 401:
        case 403:
          throw rejected(
            'O serviço recusou a autenticação. Confira EXAM_UPLOAD_TOKEN no servidor.',
            502,
          );
        case 409:
          throw rejected(
            'O serviço informou um conflito para este envio. Verifique se o exame já foi enviado.',
            409,
          );
        case 400:
        case 404:
        case 422:
          throw rejected(
            'O serviço recusou os dados do exame. Confira o código externo do animal e os dados cadastrados.',
            422,
          );
        case 429:
          throw rejected('Limite de envios atingido. Aguarde e tente novamente.', 429);
        default:
          throw rejected(
            `A integração retornou HTTP ${response.status} e não concluiu o envio.`,
            502,
          );
      }
    }
  });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/api';
import { fetchExamForPdf } from '@/services/examPdf';
import { ExamUploadTimings } from '@/services/examUploadTimings';
import { ExamUploadError, uploadExam } from '@/services/uploadExam';

export const config = { api: { bodyParser: false }, maxDuration: 120 };

// Pages API mantém o renderizador e os templates no React 18 instalado no projeto.
// No App Router, o React de RSC é incompatível com esse renderizador.
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método não permitido.' });
  }
  const id = request.query.id;
  if (typeof id !== 'string' || !id) {
    return response.status(400).json({ error: 'Informe o ID do exame.' });
  }
  const timings = new ExamUploadTimings();
  function send(status: number, body: Record<string, unknown>) {
    const timingsMs = timings.snapshot();
    console.info('[exam-upload:tempos]', { examId: id, status, timingsMs });
    response.setHeader(
      'Server-Timing',
      Object.entries(timingsMs)
        .map(([step, duration]) => `${step};dur=${duration}`)
        .join(', '),
    );
    return response.status(status).json({ ...body, timingsMs });
  }
  let stage = 'autenticacao';
  try {
    const supabase = createClient(request, response);
    const {
      data: { user },
      error,
    } = await timings.measure('autenticacao', () => supabase.auth.getUser());
    if (error || !user) {
      return send(401, { error: 'Sessão expirada. Entre novamente.' });
    }

    const token = process.env.EXAM_UPLOAD_TOKEN?.trim();
    if (!token) {
      return send(503, { error: 'Configure EXAM_UPLOAD_TOKEN no servidor.' });
    }

    stage = 'consulta_exame';
    // Usa a sessão do usuário e as políticas RLS; nenhuma chave administrativa é necessária.
    const exam = await timings.measure('consulta_exame', () => fetchExamForPdf(supabase, id));
    if (!exam) {
      return send(404, { error: 'Exame não encontrado ou sem permissão de acesso.' });
    }

    stage = 'geracao_pdf';
    await uploadExam(exam, token, timings);
    return send(200, { message: 'Exame enviado com sucesso ao SimplesVet!' });
  } catch (error) {
    if (error instanceof ExamUploadError) {
      return send(error.status, {
        error: error.message,
        ...(error.upstream
          ? {
              code: 'resposta_integracao',
              upstreamStatus: error.upstream.status,
              requestId: error.upstream.requestId,
            }
          : {}),
      });
    }
    console.error(`[exam-upload:${stage}]`, error);
    return send(500, {
      error:
        stage === 'consulta_exame'
          ? 'Não foi possível buscar os dados do exame.'
          : stage === 'geracao_pdf'
            ? 'Não foi possível gerar o PDF do exame.'
            : 'Não foi possível verificar a sessão do usuário.',
      code: stage,
    });
  }
}

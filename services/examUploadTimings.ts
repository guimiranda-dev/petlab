type UploadStep = 'autenticacao' | 'consulta_exame' | 'geracao_pdf' | 'integracao';

export class ExamUploadTimings {
  private startedAt = performance.now();
  private durations: Partial<Record<UploadStep, number>> = {};

  async measure<T>(step: UploadStep, action: () => Promise<T>): Promise<T> {
    const startedAt = performance.now();
    try {
      return await action();
    } finally {
      this.durations[step] = Math.round((performance.now() - startedAt) * 10) / 10;
    }
  }

  snapshot() {
    return {
      ...this.durations,
      total: Math.round((performance.now() - this.startedAt) * 10) / 10,
    };
  }
}

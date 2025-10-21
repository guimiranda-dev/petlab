export enum ExamType {
  hemograma = 'hemograma',
  bioquimico = 'bioquimico',
  reticulocitos = 'reticulocitos',
  coproparasitologico = 'coproparasitologico',
  urinalise = 'urinalise',
}

export const ExamTypeMap: Record<ExamType, { label: string }> = {
  [ExamType.hemograma]: { label: 'Hemograma' },
  [ExamType.bioquimico]: { label: 'Bioquímico' },
  [ExamType.reticulocitos]: { label: 'Contagem de reticulócitos' },
  [ExamType.coproparasitologico]: { label: 'Coproparasitológico' },
  [ExamType.urinalise]: { label: 'Urinálise' },
};

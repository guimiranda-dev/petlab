import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { ExamType } from '@/types/exam_types';
import { ExamReferenceValues } from '@/types/exam_reference_values';

interface ResponseData {
  data: ExamReferenceValues[];
}

async function getExamReferenceValues(examType: ExamType): Promise<ResponseData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam_reference_values')
    .select('*')
    .order('exam_subgroup', { ascending: true })
    .order('order', { ascending: true })
    .eq('exam_type', examType)
    .overrideTypes<ExamReferenceValues[]>();

  if (error) {
    throw error;
  }

  return { data };
}

export function useExamsReferenceValuesQuery(examType?: ExamType) {
  return useQuery({
    queryKey: ['exams-values', examType],
    queryFn: () => examType && getExamReferenceValues(examType),
    enabled: !!examType,
    select: (data) => data || { data: [] },
    initialData: { data: [] },
  });
}

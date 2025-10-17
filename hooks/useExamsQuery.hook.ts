import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { ExamInterface } from '@/types/exam';
import { ExamType } from '@/types/exam_types';

interface ExamsRequest {
  limit: number;
  currentPage: number;
  keyword: string;
  type: ExamType | null;
}

async function getExams(): Promise<{ data: ExamInterface[] }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam')
    .select(
      `
      *,
      vet:vet(*),
      pet:pet(
        *,
        owner:owner(name)
      ),
      exam_values(*)
    `,
    )
    .order('date', { ascending: false })
    .overrideTypes<ExamInterface[]>();

  if (error) {
    throw error;
  }

  return { data };
}

export function useExamsQueryHook(props: ExamsRequest) {
  return useQuery({
    queryKey: ['exams', props],
    queryFn: getExams,
  });
}

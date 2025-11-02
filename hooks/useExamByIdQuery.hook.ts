import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { ExamInterface } from '@/types/exam';

async function getExam(id: string | null): Promise<{ data: ExamInterface | null }> {
  if (!id) {
    return { data: null };
  }
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exam')
    .select(
      `
      *,
      vet:vet(*),
      pet:pet(
        *,
        owner:owner(name, id)
      ),
      exam_values(*, exam_reference_values(*))
    `,
    )
    .is('deleted_at', null)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return { data };
}

export function useExamByIdQuery(id: string | null) {
  return useQuery({
    queryKey: ['exam-by-id', id],
    queryFn: () => getExam(id),
    enabled: !!id,
  });
}

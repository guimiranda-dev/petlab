import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { ExamInterface } from '@/types/exam';
import { ExamType } from '@/types/exam_types';

export interface ExamsRequest {
  limit: number;
  currentPage: number;
  keyword: string; // Owner name or Pet name
  type: ExamType | null;
  startDate: string | null;
  endDate: string | null;
}

async function getExams(props: ExamsRequest): Promise<{ data: ExamInterface[]; count: number }> {
  const supabase = createClient();
  const { limit, currentPage, keyword, type, startDate, endDate } = props;

  const offset = (currentPage - 1) * limit;

  let query = supabase
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
      { count: 'estimated' },
    )
    .is('deleted_at', null);

  // Filtro por tipo de exame
  if (type) {
    query = query.eq('exam_type', type);
  }

  // Filtro por data inicial
  if (startDate) {
    query = query.gte('date', startDate);
  }

  // Filtro por data final
  if (endDate) {
    query = query.lte('date', endDate);
  }

  // Filtro por keyword (nome do dono ou pet)
  if (keyword && keyword.trim() !== '') {
    // query = query.or(`pet.name.ilike.${keyword}`);
    // query = query.or(`pet.name.ilike.%${keyword}%`);
    // query = query.or(`pet.name.ilike.%${keyword}%,pet.owner.name.ilike.%${keyword}%`);
  }

  // Ordenação, paginação e execução
  const { data, error, count } = await query
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)
    .overrideTypes<ExamInterface[]>();

  if (error) {
    throw error;
  }

  return { data, count: count || 1 };
}

export function useExamsQueryHook(props: ExamsRequest) {
  return useQuery({
    queryKey: ['exams', props],
    queryFn: () => getExams(props),
  });
}

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

async function getExams() {
  const supabase = createClient();

  const { data } = await supabase.from('exams').select('*').order('name', { ascending: true });

  return { data };
}

export function useExamsQueryHook() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
  });
}

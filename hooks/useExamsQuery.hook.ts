import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

async function getExams() {
  const supabase = createClient();

  const { data } = await supabase
    .from('users')
    .select('id, name, email, user_permission_roles!inner(role)')
    .order('name', { ascending: true });

  return { data };
}

export function useExamsQueryHook() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
  });
}

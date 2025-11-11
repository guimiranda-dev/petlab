import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const deletePet = async (id: string) => {
  const supabase = createClient();

  const { data: exams, error: examsError } = await supabase
    .from('exam')
    .select('id')
    .in('pet_id', [id])
    .is('deleted_at', null);

  if (examsError) {
    throw new Error(examsError.message);
  }

  if (exams && exams.length > 0) {
    throw new Error('Não é possível excluir o tutor pois existem exames vinculados aos pets dele.');
  }

  const { error: examError } = await supabase.from('exam').delete().eq('pet_id', id);

  if (examError) {
    throw new Error(examError.message);
  }

  const { error: userError } = await supabase.from('pet').delete().eq('id', id);

  if (userError) {
    throw new Error(userError.message);
  }

  return;
};

export function useDeletePetMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: deletePet,
    onSuccess,
    onError,
  });
}

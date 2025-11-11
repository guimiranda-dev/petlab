import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const deletePet = async (id: string) => {
  const supabase = createClient();

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

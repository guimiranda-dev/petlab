import { PetType } from '@/types/pet';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const savePet = async (props: Omit<Partial<PetType>, 'id'>) => {
  const supabase = createClient();

  const { error: userError } = await supabase.from('pet').insert(props);

  if (userError) {
    throw new Error(userError.message);
  }

  return;
};

export function usePetMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: savePet,
    onSuccess,
    onError,
  });
}

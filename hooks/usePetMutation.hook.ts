import { PetType } from '@/types/pet';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: (e: PetType) => void;
}

const savePet = async (props: Omit<Partial<PetType>, 'id'>): Promise<PetType> => {
  const supabase = createClient();

  const { data, error: userError } = await supabase.from('pet').insert(props).select().single();

  if (userError) {
    throw new Error(userError.message);
  }

  return data;
};

export function usePetMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: savePet,
    onSuccess,
    onError,
  });
}

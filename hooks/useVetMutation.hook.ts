import { createClient } from '@/utils/supabase/client';
import { VetType } from '@/types/vet';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: (e: VetType) => void;
}

const saveVet = async (props: { name: string; cmv: string; id?: number | string }): Promise<VetType> => {
  const supabase = createClient();

  if (props.id) {
    const { data, error: vetError } = await supabase
      .from('vet')
      .update(props)
      .eq('id', props.id)
      .select()
      .single();

    if (vetError) {
      throw new Error(vetError.message);
    }

    return data;
  }

  const { data, error: vetError } = await supabase.from('vet').insert(props).select().single();

  if (vetError) {
    throw new Error(vetError.message);
  }

  return data;
};

export function useVetMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: saveVet,
    onSuccess,
    onError,
  });
}

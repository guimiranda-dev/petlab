import { OwnerType } from '@/types/owner';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: (e: OwnerType) => void;
}

const saveOwner = async (props: { name: string; external_id?: string }): Promise<OwnerType> => {
  const supabase = createClient();

  const { data, error: userError } = await supabase.from('owner').insert(props).select().single();

  if (userError) {
    throw new Error(userError.message);
  }

  return data;
};

export function useOwnerMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: saveOwner,
    onSuccess,
    onError,
  });
}

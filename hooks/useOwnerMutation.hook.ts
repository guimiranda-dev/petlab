import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const saveOwner = async (props: { name: string; external_id?: string }) => {
  const supabase = createClient();

  const { error: userError } = await supabase.from('owner').insert(props);

  if (userError) {
    throw new Error(userError.message);
  }

  return;
};

export function useOwnerMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: saveOwner,
    onSuccess,
    onError,
  });
}

import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const saveOwner = async ({ name }: { name: string }) => {
  const supabase = createClient();

  const { error: userError } = await supabase.from('owner').insert({ name });

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

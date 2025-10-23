import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const deleteExam = async (examId: string) => {
  const supabase = createClient();

  const { error: userError } = await supabase
    .from('exam')
    .update({ deleted_at: DateTime.now().toISO() })
    .eq('id', examId);

  if (userError) {
    throw new Error(userError.message);
  }

  return;
};

export function useDeleteExamMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: deleteExam,
    onSuccess,
    onError,
  });
}

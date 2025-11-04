import { ExamType } from '@/types/exam_types';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

interface ExamTypeRequest {
  pet_id: string;
  vet_id: string;
  date: string;
  exam_type: ExamType | null;
  obs: string;
}

export interface ExamValuesRequest {
  exam_reference_id: number;
  value: string;
  relative?: string;
  exam_id: number;
  reference_value: string;
}

interface ExamRequest {
  exam: ExamTypeRequest;
  examValues: ExamValuesRequest[];
  id: string | null;
}

const saveExam = async ({ exam, examValues, id }: ExamRequest) => {
  const supabase = createClient();

  if (id) {
    // Update
    const { error: userError } = await supabase.from('exam').update(exam).eq('id', id);

    if (userError) {
      throw new Error(userError.message);
    }

    const examsWithId = examValues.map((i) => ({
      ...i,
      exam_id: id,
    }));

    await supabase.from('exam_values').delete().eq('exam_id', id);

    const { error: valuesError } = await supabase.from('exam_values').insert(examsWithId);

    if (valuesError) {
      throw new Error(valuesError.message);
    }
  } else {
    // Insert
    const { data, error: userError } = await supabase.from('exam').insert(exam).select('*');
    if (userError) {
      throw new Error(userError.message);
    }

    const examsWithId = examValues.map((i) => ({
      ...i,
      exam_id: data[0].id,
    }));

    const { error: valuesError } = await supabase.from('exam_values').insert(examsWithId);

    if (valuesError) {
      throw new Error(valuesError.message);
    }
  }

  return;
};

export function useExamMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: saveExam,
    onSuccess,
    onError,
  });
}

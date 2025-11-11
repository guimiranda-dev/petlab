import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

interface Props {
  onError: (e: Error) => void;
  onSuccess: () => void;
}

const deleteOwner = async (ownerId: string) => {
  const supabase = createClient();

  // Verificar se o owner tem pets
  const { data: pets, error: petsError } = await supabase
    .from('pet')
    .select('id')
    .eq('owner_id', ownerId);

  if (petsError) {
    throw new Error(petsError.message);
  }

  // Se tiver pets, verificar se algum deles tem exames
  if (pets && pets.length > 0) {
    const petIds = pets.map((pet) => pet.id);

    const { data: exams, error: examsError } = await supabase
      .from('exam')
      .select('id')
      .in('pet_id', petIds)
      .is('deleted_at', null);

    if (examsError) {
      throw new Error(examsError.message);
    }

    if (exams && exams.length > 0) {
      throw new Error(
        'Não é possível excluir o tutor pois existem exames vinculados aos pets dele.',
      );
    }

    const { error: deletePetsError } = await supabase.from('pets').delete().eq('owner_id', ownerId);

    if (deletePetsError) {
      throw new Error(deletePetsError.message);
    }
  }

  const { error: deleteOwnerError } = await supabase.from('owner').delete().eq('id', ownerId);

  if (deleteOwnerError) {
    throw new Error(deleteOwnerError.message);
  }

  return;
};

export function useDeleteOwnerMutation({ onSuccess, onError }: Props) {
  return useMutation({
    mutationFn: deleteOwner,
    onSuccess,
    onError,
  });
}

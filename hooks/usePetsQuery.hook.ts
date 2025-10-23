'use client';

import { PetType } from '@/types/pet';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PetRequest {
  owner_id?: string;
}

interface ResponseData {
  data: PetType[];
}

const getPets = async ({ owner_id }: PetRequest): Promise<ResponseData> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pet')
    .select('*')
    .eq('owner_id', owner_id)
    .overrideTypes<PetType[]>();

  if (error) {
    throw error;
  }

  return { data };
};

export function usePetsQuery(props: PetRequest) {
  return useQuery({
    queryFn: () => getPets(props),
    queryKey: ['pets', props],
    enabled: !!props.owner_id,
    select: (data) => data || { data: [] },
  });
}

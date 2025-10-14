'use client';

import { VetType } from '@/types/vet';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ResponseData {
  data: VetType[];
}

const getVets = async (): Promise<ResponseData> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('vet').select('*').overrideTypes<VetType[]>();

  if (error) {
    throw error;
  }

  return { data };
};

export function useVetQuery() {
  return useQuery({
    queryFn: getVets,
    queryKey: ['vets'],
  });
}

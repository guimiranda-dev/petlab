'use client';

import { PetType } from '@/types/pet';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface PetRequest {
  limit: number;
  currentPage: number;
  keyword?: string;
  owner?: string;
}

interface ResponseData {
  data: PetType[];
}

const getPets = async ({
  limit,
  currentPage,
  keyword,
  owner,
}: PetRequest): Promise<ResponseData> => {
  const supabase = createClient();

  let query;

  query = supabase.from('pet').select('*');

  query
    .order('name', { ascending: true })
    .range((currentPage - 1) * limit, currentPage * limit - 1);

  if (owner) {
    query = query.eq('owner_id', owner);
  }

  if (keyword && keyword !== '') {
    const fields = ['name'];

    const filter = [...fields.map((field) => `${field}.ilike.%${keyword}%`)];

    // Se for número, adiciona filtro por ID exato
    if (!isNaN(Number(keyword))) {
      filter.push(`external_id.eq.${Number(keyword)}`);
    }

    query = query.or(filter.join(','));
  }

  const { data, error, count } = await query.overrideTypes<PetType[]>();

  if (error) {
    throw error;
  }

  return { data };
};

export function useAllPetsQuery(props: PetRequest) {
  return useQuery({
    queryFn: () => getPets(props),
    queryKey: ['all-pets', props],
  });
}

'use client';

import { isUdid } from '@/utils/isUdid';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface OwnerRequest {
  limit: number;
  currentPage: number;
  keyword?: string;
}

interface OwnerResponse {
  id: string;
  name: string;
  external_id: string;
}

interface ResponseData {
  data: OwnerResponse[];
  count: number;
}

const getOwners = async ({ limit, currentPage, keyword }: OwnerRequest): Promise<ResponseData> => {
  const supabase = createClient();

  let query;

  query = supabase.from('owner').select('*', { count: 'estimated' });

  query
    .order('name', { ascending: true })
    .range((currentPage - 1) * limit, currentPage * limit - 1);

  if (keyword && keyword !== '') {
    const fields = ['name'];

    const filter = [...fields.map((field) => `${field}.ilike.%${keyword}%`)];

    // Se for número, adiciona filtro por ID exato
    if (!isNaN(Number(keyword))) {
      filter.push(`external_id.eq.${Number(keyword)}`);
    }

    // Se for UUID, adiciona filtro por ID exato
    if (isUdid(keyword)) {
      filter.push(`id.eq.${keyword}`);
    }

    query = query.or(filter.join(','));
  }

  const { data, error, count } = await query.overrideTypes<OwnerResponse[]>();

  if (error) {
    throw error;
  }

  return { data, count: count || 1 };
};

export function useOwnersQuery(props: OwnerRequest) {
  return useQuery({
    queryFn: () => getOwners(props),
    queryKey: ['owners', props],
  });
}

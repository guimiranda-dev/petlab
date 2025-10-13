'use client';

import { isUdid } from '@/utils/isUdid';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface UserRequest {
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
}

const getOwners = async ({ limit, currentPage, keyword }: UserRequest): Promise<ResponseData> => {
  const supabase = createClient();

  let query;

  query = supabase.from('owner').select('*');

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

  const { data, error } = await query.overrideTypes<OwnerResponse[]>();

  if (error) {
    throw error;
  }

  return { data };
};

export function useOwnersQuery(props: UserRequest) {
  return useQuery({
    queryFn: () => getOwners(props),
    queryKey: ['owners', props],
  });
}

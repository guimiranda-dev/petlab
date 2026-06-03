import { createClient } from '@/utils/supabase/client';

interface Props {
  external_id: string;
  ownerId?: string;
}

export async function checkOwnerExternalIdUnique({ external_id, ownerId }: Props) {
  const supabase = createClient();

  const externalId = external_id.trim();
  const externalIdFilter = /^\d+$/.test(externalId) ? Number(externalId) : externalId;

  let query = supabase.from('owner').select('id').eq('external_id', externalIdFilter);

  if (ownerId) {
    query = query.neq('id', ownerId);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return (data?.length ?? 0) === 0;
}

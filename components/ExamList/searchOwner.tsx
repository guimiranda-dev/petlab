import { OwnerResponse, useOwnersQuery } from '@/hooks/useOwnersQuery.hook';
import Autocomplete, { AutocompleteRef } from '../autocomplete';
import { Key, useRef, useState } from 'react';

interface Props {
  selectedOwner: string | undefined;
  onSelectionChange: (e: Key | null, owners: OwnerResponse[]) => void;
}

export function SearchOwner({ selectedOwner, onSelectionChange }: Props) {
  const autocompleteRef = useRef<AutocompleteRef>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const { data: owners, isFetching } = useOwnersQuery({
    limit: 20,
    currentPage: 1,
    keyword: String(filterValue),
  });

  return (
    <div className='w-full max-w-full'>
      <Autocomplete
        selectedKey={selectedOwner || null}
        ref={autocompleteRef}
        placeholder='Selecione uma opção'
        defaultItems={
          owners?.data?.map((i) => ({
            key: String(i.id),
            label: `${i.external_id ? `${i.external_id} - ` : ''} ${i.name}`,
          })) || []
        }
        onSelectionChange={(e) => onSelectionChange(e, owners?.data || [])}
        onInputChange={(v) => {
          setInputValue(v);
          setFilterValue(v);
        }}
        isLoading={isFetching}
        containerClassName='w-full'
        className='w-full'
        label='Tutor'
        inputValue={inputValue}
        listboxProps={{
          emptyContent: (
            <div className='flex flex-col gap-2'>
              <span className='text-sm text-muted'>Nenhum tutor encontrado</span>
            </div>
          ),
        }}
      />
    </div>
  );
}

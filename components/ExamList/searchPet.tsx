import Autocomplete, { AutocompleteRef } from '../autocomplete';
import { Key, useEffect, useRef, useState } from 'react';
import { useAllPetsQuery } from '@/hooks/useAllPetsQuery.hook';
import { PetType } from '@/types/pet';

interface Props {
  selectedOwner: string | undefined;
  selectedPet: string | undefined;
  onSelectionChange: (e: Key | null, pets: PetType[]) => void;
}

export function SearchPet({ selectedOwner, selectedPet, onSelectionChange }: Props) {
  const autocompleteRef = useRef<AutocompleteRef>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const { data: pets, isFetching } = useAllPetsQuery({
    limit: 20,
    currentPage: 1,
    keyword: String(filterValue),
    owner: selectedOwner,
  });

  useEffect(() => {
    autocompleteRef.current?.clear();
  }, [selectedOwner]);

  return (
    <div className='w-full max-w-full'>
      <Autocomplete
        selectedKey={selectedPet || null}
        ref={autocompleteRef}
        placeholder='Selecione uma opção'
        defaultItems={
          pets?.data?.map((i) => ({
            key: String(i.id),
            label: `${i.external_id ? `${i.external_id} - ` : ''} ${i.name}`,
          })) || []
        }
        onSelectionChange={(e) => onSelectionChange(e, pets?.data || [])}
        onInputChange={(v) => {
          setInputValue(v);
          setFilterValue(v);
        }}
        isLoading={isFetching}
        containerClassName='w-full'
        className='w-full'
        label='Pet'
        inputValue={inputValue}
        listboxProps={{
          emptyContent: (
            <div className='flex flex-col gap-2'>
              <span className='text-sm text-muted'>Nenhum pet encontrado</span>
            </div>
          ),
        }}
      />
    </div>
  );
}

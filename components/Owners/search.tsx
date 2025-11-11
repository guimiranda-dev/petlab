'use client';

import { OwnerRequest } from '@/hooks/useOwnersQuery.hook';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

interface Props {
  searchValues: OwnerRequest;
  onSearch: (value: OwnerRequest) => void;
}

export function SearchOwner({ searchValues, onSearch }: Props) {
  const [keyword, setKeyword] = useState('');

  return (
    <div className='flex flex-row items-center gap-2 my-4'>
      <Input
        placeholder='Procure pelo nome do tutor'
        className='max-w-full w-full'
        endContent={
          <AiOutlineSearch
            onClick={() =>
              onSearch({
                ...searchValues,
                keyword,
              })
            }
            className='cursor-pointer'
            size={20}
          />
        }
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        type='search'
        label='Pesquisar'
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          onSearch({
            ...searchValues,
            keyword,
          })
        }
      />
    </div>
  );
}

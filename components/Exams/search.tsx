'use client';

import { Input } from '@heroui/input';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

interface Props {
  onSearch: (value: string) => void;
}

export function SearchExam({ onSearch }: Props) {
  const [value, setValue] = useState('');

  // Filtro por data
  // Filtro por tipo de exame

  return (
    <div className='flex flex-row items-center gap-2'>
      <Input
        placeholder='Procure pelo nome do exame'
        className='max-w-[300px]'
        endContent={
          <AiOutlineSearch onClick={() => onSearch(value)} className='cursor-pointer' size={20} />
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type='search'
        label='Pesquisar'
        onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
        onClear={() => onSearch('')}
      />
    </div>
  );
}

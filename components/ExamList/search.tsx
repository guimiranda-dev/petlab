'use client';

import { ExamType } from '@/types/exam_types';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

interface Props {
  onSearch: (value: string) => void;
}

const exams: { key: ExamType; label: string }[] = Object.entries(ExamType).map(([key, value]) => ({
  key: key as ExamType,
  label: value,
}));

export function SearchExam({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const [selectedType, setSelectedType] = useState<ExamType | null>(null);

  // Filtro por data
  // Filtro por tipo de exame

  return (
    <div className='flex flex-row items-center gap-2 my-4'>
      <Input
        placeholder='Procure pelo nome do exame'
        className='max-w-full w-full'
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
      <Input
        placeholder='Procure pelo nome do exame'
        className='max-w-full w-[200px]'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type='date'
        label='Data de início'
        onClear={() => onSearch('')}
      />

      <Input
        placeholder='Procure pelo nome do exame'
        className='max-w-full w-[200px]'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type='date'
        label='Data de fim'
        onClear={() => onSearch('')}
      />

      <Select
        isClearable
        label='Tipo do exame'
        placeholder='Selecione uma opção'
        selectedKeys={selectedType ? [selectedType] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setSelectedType(selectedKey as ExamType);
        }}
      >
        {exams.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

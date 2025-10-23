'use client';

import { ExamsRequest } from '@/hooks/useExamsQuery.hook';
import { ExamType, ExamTypeMap } from '@/types/exam_types';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

interface Props {
  searchValues: ExamsRequest;
  onSearch: (value: ExamsRequest) => void;
}

const exams = Object.entries(ExamTypeMap).map(([key, value]) => ({
  key: key as ExamType,
  label: value.label,
}));

export function SearchExam({ searchValues, onSearch }: Props) {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState<ExamType | null>(null);

  useEffect(() => {
    onSearch({
      ...searchValues,
      startDate,
      endDate,
      type: selectedType,
    });
  }, [startDate, endDate, selectedType]);

  return (
    <div className='flex flex-row items-center gap-2 my-4'>
      <Input
        placeholder='Procure pelo nome do pet ou do tutor'
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
      <Input
        className='max-w-full w-[200px]'
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        type='date'
        label='Data de início'
        onClear={() => setStartDate('')}
      />

      <Input
        className='max-w-full w-[200px]'
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        type='date'
        label='Data de fim'
        onClear={() => setEndDate('')}
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

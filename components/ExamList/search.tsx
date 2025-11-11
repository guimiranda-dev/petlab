'use client';

import { ExamsRequest } from '@/hooks/useExamsQuery.hook';
import { ExamType, ExamTypeMap } from '@/types/exam_types';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Key, useEffect, useState } from 'react';
import { SearchOwner } from './searchOwner';
import { OwnerResponse } from '@/hooks/useOwnersQuery.hook';
import { SearchPet } from './searchPet';
import { PetType } from '@/types/pet';

interface Props {
  searchValues: ExamsRequest;
  onSearch: (value: ExamsRequest) => void;
}

const exams = Object.entries(ExamTypeMap).map(([key, value]) => ({
  key: key as ExamType,
  label: value.label,
}));

export function SearchExam({ searchValues, onSearch }: Props) {
  const [selectedOwner, setSelectedOwner] = useState<string | undefined>();
  const [selectedPet, setSelectedPet] = useState<string | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState<ExamType | null>(null);

  const onOwnerSelectionChange = (e: Key | null, owners: OwnerResponse[]) => {
    if (owners) {
      const selected = owners.find((i) => i.id === e);
      if (selected) {
        setSelectedOwner(String(selected.id));
      } else {
        setSelectedOwner(undefined);
      }
    } else {
      setSelectedOwner(undefined);
    }
  };

  const onPetSelectionChange = (e: Key | null, pets: PetType[]) => {
    if (pets) {
      const selected = pets.find((i) => i.id === e);
      if (selected) {
        setSelectedPet(String(selected.id));
      } else {
        setSelectedPet(undefined);
      }
    } else {
      setSelectedPet(undefined);
    }
  };

  useEffect(() => {
    onSearch({
      ...searchValues,
      startDate,
      endDate,
      type: selectedType,
      owner: selectedOwner,
      pet: selectedPet,
    });
  }, [startDate, endDate, selectedType, selectedOwner, selectedPet]);

  return (
    <div className='flex flex-row items-center gap-2 my-4'>
      <SearchOwner onSelectionChange={onOwnerSelectionChange} selectedOwner={selectedOwner} />
      <SearchPet
        onSelectionChange={onPetSelectionChange}
        selectedPet={selectedPet}
        selectedOwner={selectedOwner}
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

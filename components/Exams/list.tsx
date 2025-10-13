'use client';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { useState } from 'react';
import { ExamType } from '@/types/exam_types';
import { RowItem } from './row-item';

interface Props {
  amount: number;
  hasPagination?: boolean;
}

interface ColumnsProps {
  name: string;
  uid: string;
  alignment?: 'center' | 'end' | 'start';
}

const columns: ColumnsProps[] = [
  { name: 'Protocolo', uid: 'id' },
  { name: 'Tipo do Exame', uid: 'exam_type' },
  { name: 'Data', uid: 'date', alignment: 'center' },
  { name: 'Espécie/Raça', uid: 'specie' },
  { name: 'Nome do animal', uid: 'pet_name' },
  { name: 'Proprietário', uid: 'owner' },
  { name: 'Veterinário', uid: 'vet' },
  { name: 'Ações', uid: 'actions', alignment: 'center' },
];

const examData = [
  {
    id: 'PR001',
    exam_type: ExamType.hemograma,
    date: '2024-09-15',
    specie: 'Cão/Golden Retriever',
    pet_name: 'Max',
    owner: '2312 - Ana Silva',
    vet: 'Dr. Carlos Mendes',
  },
  {
    id: 'PR005',
    exam_type: ExamType.bioquimico,
    date: '2024-09-19',
    specie: 'Cão/Labrador',
    pet_name: 'Buddy',
    owner: '2312 - Ricardo Alves',
    vet: 'Dr. Fernando Souza',
  },
  {
    id: 'PR006',
    exam_type: ExamType.hemograma,
    date: '2024-09-20',
    specie: 'Cão/Bulldog Francês',
    pet_name: 'Thor',
    owner: '2312 - Camila Martins',
    vet: 'Dra. Patrícia Campos',
  },
  {
    id: 'PR007',
    exam_type: ExamType.bioquimico,
    date: '2024-09-21',
    specie: 'Gato/Maine Coon',
    pet_name: 'Garfield',
    owner: '2312 - Lucas Pereira',
    vet: 'Dr. Anderson Silva',
  },
  {
    id: 'PR008',
    exam_type: ExamType.hemograma,
    date: '2024-09-22',
    specie: 'Cão/Beagle',
    pet_name: 'Mel',
    owner: '2312 - Fernanda Lima',
    vet: 'Dra. Juliana Barbosa',
  },
  {
    id: 'PR009',
    exam_type: ExamType.hemograma,
    date: '2024-09-23',
    specie: 'Coelho/Angorá',
    pet_name: 'Branquinho',
    owner: '2312 - Guilherme Rocha',
    vet: 'Dr. Marcos Dias',
  },
  {
    id: 'PR010',
    exam_type: ExamType.bioquimico,
    date: '2024-09-24',
    specie: 'Cão/Rottweiler',
    pet_name: 'Duque',
    owner: '2312 - Tatiana Moreira',
    vet: 'Dra. Roberta Santos',
  },
  {
    id: 'PR011',
    exam_type: ExamType.coproparasitologico,
    date: '2024-09-25',
    specie: 'Gato/Ragdoll',
    pet_name: 'Princesa',
    owner: '2312 - André Carvalho',
    vet: 'Dr. Paulo Mendes',
  },
  {
    id: 'PR012',
    exam_type: ExamType.hemograma,
    date: '2024-09-26',
    specie: 'Cão/Poodle',
    pet_name: 'Bolt',
    owner: '2312 - Silvia Nascimento',
    vet: 'Dra. Carolina Vieira',
  },
];

export function ExamList({ amount, hasPagination }: Props) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  return (
    <Table
      aria-label='Exames'
      isStriped
      bottomContent={
        hasPagination ? (
          <div className='flex w-full justify-center'>
            <Pagination
              isCompact
              showControls
              showShadow
              color='secondary'
              page={page}
              total={totalPages}
              onChange={(page: number) => setPage(page)}
            />
          </div>
        ) : null
      }
      classNames={{
        wrapper: 'min-h-[222px]',
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.alignment || 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={examData}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className='p-4'>{<RowItem user={item} columnKey={columnKey} />}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

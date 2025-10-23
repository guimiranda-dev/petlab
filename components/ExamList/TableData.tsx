import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { RowItem } from './row-item';
import { ExamInterface } from '@/types/exam';
import { useState } from 'react';
import { addToast } from '@heroui/toast';
import { MdCheck, MdError } from 'react-icons/md';
import { useDeleteExamMutation } from '@/hooks/useDeleteExamMutation.hook';
import { DeleteConfirmationModal } from '../deleteConfirmationModal';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  data: ExamInterface[];
}

interface ColumnsProps {
  name: string;
  uid: string;
  alignment?: 'center' | 'end' | 'start';
}

const columns: ColumnsProps[] = [
  // { name: 'Protocolo', uid: 'id' },
  { name: 'Tipo do Exame', uid: 'exam_type' },
  { name: 'Data', uid: 'date', alignment: 'center' },
  { name: 'Espécie/Raça', uid: 'specie' },
  { name: 'Nome do animal', uid: 'pet_name' },
  { name: 'Proprietário', uid: 'owner' },
  { name: 'Veterinário', uid: 'vet' },
  { name: 'Ações', uid: 'actions', alignment: 'center' },
];

export function ExamTableData({ page, setPage, totalPages, data }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState('');
  const queryClient = useQueryClient();

  const onDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['exams'] });
    addToast({
      icon: <MdCheck className='text-white' />,
      description: 'Exame deletado com sucesso!',
      color: 'success',
    });
  };

  const onDeleteError = () => {
    addToast({
      icon: <MdError className='text-white' />,
      description: 'Erro ao deletar o exame!',
      color: 'danger',
    });
  };

  const { mutate, isPending } = useDeleteExamMutation({
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  });

  return (
    <>
      <Table
        aria-label='Exames'
        isStriped
        bottomContent={
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
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className='p-4'>
                  <RowItem
                    exam={item}
                    columnKey={columnKey}
                    handleDelete={(examId) => setShowDeleteConfirmation(examId)}
                    isPendingDelete={isPending}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          isOpen={!!showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation('')}
          onConfirm={() => mutate(showDeleteConfirmation)}
          title='Tem certeza que deseja deletar esse exame?'
        />
      )}
    </>
  );
}

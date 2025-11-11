import { Pagination } from '@heroui/pagination';
import { RowItem } from './row-item';
import { OwnerType } from '@/types/owner';
import React, { useState } from 'react';
import { addToast } from '@heroui/toast';
import { MdCheck, MdError } from 'react-icons/md';
import { DeleteConfirmationModal } from '../deleteConfirmationModal';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteOwnerMutation } from '@/hooks/useDeleteOwnerMutation.hook';
import { PetsSection } from './PetSection';
import clsx from 'clsx';

const thClass = clsx(
  'group/th px-3 h-10 align-middle bg-default-100 whitespace-nowrap',
  'text-foreground-500 text-tiny font-semibold first:rounded-s-lg last:rounded-e-lg',
  'data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400',
  'outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2',
);

const trClass = clsx(
  'group/tr outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2',
);

const tdClass = clsx(
  'relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:pointer-events-none before:content-[""] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]/tr:text-foreground-300 group-data-[disabled=true]/tr:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground group-data-[odd=true]/tr:before:bg-default-100 group-data-[odd=true]/tr:before:opacity-100 group-data-[odd=true]/tr:before:-z-10 first:before:rounded-s-lg last:before:rounded-e-lg text-start group-data-[odd=true]/tr:data-[selected=true]/tr:before:bg-default/60 p-4',
);

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  data: OwnerType[];
  onEdit: (owner: OwnerType) => void;
}

interface ColumnsProps {
  name: string;
  uid: string;
  alignment?: 'center' | 'end' | 'start';
}

const columns: ColumnsProps[] = [
  { name: 'Nome', uid: 'name' },
  { name: 'Código Externo', uid: 'external_id', alignment: 'center' },
  { name: 'Ações', uid: 'actions', alignment: 'center' },
];

export function OwnerTableData({ page, setPage, totalPages, data, onEdit }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState('');
  const queryClient = useQueryClient();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (ownerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(ownerId)) {
      newExpanded.delete(ownerId);
    } else {
      newExpanded.add(ownerId);
    }
    setExpandedRows(newExpanded);
  };

  const onDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['owners'] });
    addToast({
      icon: <MdCheck className='text-white' />,
      description: 'Tutor deletado com sucesso!',
      color: 'success',
    });
  };

  const onDeleteError = (e: Error) => {
    addToast({
      icon: <MdError className='text-white' />,
      description: e?.message || 'Erro ao deletar o tutor!',
      color: 'danger',
    });
  };

  const { mutate, isPending } = useDeleteOwnerMutation({
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  });

  return (
    <>
      <div className='w-full'>
        <div className='p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto shadow-small rounded-large w-full min-h-[222px]'>
          <table className='min-w-full h-auto table-auto w-full'>
            <thead className='[&amp;&gt;tr]:first:rounded-lg'>
              <tr>
                <th className={thClass + ' text-start'}>Nome</th>
                <th className={thClass + ' text-center'}>ID Externo</th>
                <th className={thClass + ' text-center'}>Ações</th>
              </tr>
            </thead>
            <tbody className='after:block'>
              {data.map((owner, index) => (
                <React.Fragment key={owner.id}>
                  <tr className={trClass} data-odd={index % 2 !== 0}>
                    {columns.map((column, columnIdx) => (
                      <td key={`${columnIdx}-${owner.id}`} className={tdClass}>
                        <RowItem
                          owner={owner}
                          columnKey={column.uid}
                          handleDelete={(ownerId) => setShowDeleteConfirmation(ownerId)}
                          isPendingDelete={isPending}
                          onToggleExpand={() => toggleRow(owner.id)}
                          onEdit={() => onEdit(owner)}
                        />
                      </td>
                    ))}
                  </tr>
                  {expandedRows.has(owner.id) && (
                    <tr className=''>
                      <td colSpan={3}>
                        <div>
                          <PetsSection ownerId={owner.id} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex w-full justify-center mt-4'>
          <Pagination
            isCompact
            showControls
            showShadow
            color='secondary'
            page={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          isOpen={!!showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation('')}
          onConfirm={() => mutate(showDeleteConfirmation)}
          title='Tem certeza que deseja deletar esse tutor?'
        />
      )}
    </>
  );
}

import { Spinner } from '@heroui/spinner';
import { usePetsQuery } from '@/hooks/usePetsQuery.hook';
import { Button } from '@heroui/button';
import { useState } from 'react';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { PetsRowItem } from './pets-row-item';
import { NewPetForm } from '../Exams/new-pet-form';
import { DeleteConfirmationModal } from '../deleteConfirmationModal';
import { addToast } from '@heroui/toast';
import { MdCheck, MdError } from 'react-icons/md';
import { useQueryClient } from '@tanstack/react-query';
import { useDeletePetMutation } from '@/hooks/useDeletePetMutation.hook';
import { PetType } from '@/types/pet';

interface PetsSectionProps {
  ownerId: string;
}

interface ColumnsProps {
  name: string;
  uid: string;
  alignment?: 'center' | 'end' | 'start';
}

const columns: ColumnsProps[] = [
  { name: 'Nome', uid: 'name' },
  { name: 'Espécie/Raça', uid: 'specie', alignment: 'center' },
  { name: 'Sexo', uid: 'gender', alignment: 'center' },
  { name: 'Idade', uid: 'age', alignment: 'center' },
  { name: 'Ações', uid: 'actions', alignment: 'center' },
];

export function PetsSection({ ownerId }: PetsSectionProps) {
  const [selectedPet, setSelectedPet] = useState<PetType>();
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState('');
  const queryClient = useQueryClient();

  const { data: pets, isLoading } = usePetsQuery({ owner_id: ownerId });

  const onDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['pets'] });
    addToast({
      icon: <MdCheck className='text-white' />,
      description: 'Pet deletado com sucesso!',
      color: 'success',
    });
  };

  const onDeleteError = (e: Error) => {
    addToast({
      icon: <MdError className='text-white' />,
      description: e?.message || 'Erro ao deletar o pet!',
      color: 'danger',
    });
  };

  const { mutate: deletePet, isPending } = useDeletePetMutation({
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  });

  console.log(selectedPet);

  if (isLoading) {
    return (
      <div className='flex justify-center py-4'>
        <Spinner size='sm' />
      </div>
    );
  }

  return (
    <>
      <div className='shadow-sm p-4 bg-gray-50'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-default-600'>🐾 Pets cadastrados</h3>
        </div>

        {(!pets || pets?.data?.length === 0) && (
          <div className='text-center py-4 text-default-400'>Nenhum pet cadastrado</div>
        )}

        <Table aria-label='Pets' removeWrapper hideHeader>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.alignment || 'start'}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={pets?.data}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className='p-4'>
                    <PetsRowItem
                      pet={item}
                      columnKey={columnKey}
                      handleDelete={(petId) => setShowDeleteConfirmation(petId)}
                      isPendingDelete={isPending}
                      handleEdit={() => setSelectedPet(item)}
                    />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Button color='primary' onPress={() => setShowNewPetForm(true)} aria-label='Adicionar pet'>
          Adicionar um novo pet
        </Button>
      </div>
      {(selectedPet || showNewPetForm) && (
        <NewPetForm
          onClose={() => {
            setShowNewPetForm(false);
            setSelectedPet(undefined);
          }}
          onSelect={() => {}}
          owner_id={ownerId}
          pet={selectedPet}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          isOpen={!!showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation('')}
          onConfirm={() => deletePet(showDeleteConfirmation)}
          title='Tem certeza que deseja deletar esse pet?'
        />
      )}
    </>
  );
}

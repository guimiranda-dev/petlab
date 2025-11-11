import { PetType } from '@/types/pet';
import { Spinner } from '@heroui/spinner';
import { Tooltip } from '@heroui/tooltip';
import { Key } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { parseISO, differenceInYears, differenceInMonths } from 'date-fns';

interface Props {
  pet: PetType;
  columnKey: Key;
  handleDelete: (petId: string) => void;
  handleEdit: () => void;
  isPendingDelete?: boolean;
}

export function PetsRowItem({ pet, columnKey, handleDelete, isPendingDelete, handleEdit }: Props) {
  function formatBirthDate(iso?: string) {
    if (!iso) return '—';
    try {
      const d = parseISO(iso);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return iso;
    }
  }

  function calculateAge(iso?: string) {
    if (!iso) return '—';
    try {
      const birth = parseISO(iso);
      const years = differenceInYears(new Date(), birth);
      if (years > 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      // se menos que 1 ano, mostrar meses
      const months = differenceInMonths(new Date(), birth);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } catch {
      return '—';
    }
  }

  switch (columnKey) {
    case 'name':
      return (
        <div className='flex items-center justify-start gap-2'>
          <p className='text-bold text-sm capitalize'>{`${pet.external_id ? `${pet.external_id} - ` : ''}${pet.name}`}</p>
        </div>
      );
    case 'specie':
      return (
        <p className='text-bold text-sm capitalize text-center'>{`${pet.specie}/${pet.breed}`}</p>
      );
    case 'gender':
      return <p className='text-bold text-sm capitalize text-center'>{pet.gender}</p>;
    case 'age':
      return (
        <p className='text-bold text-sm capitalize text-center'>{`${calculateAge(pet.birth_date)} - ${formatBirthDate(pet.birth_date)}`}</p>
      );

    default:
      return (
        <div className='relative flex items-center justify-center gap-6'>
          <Tooltip content='Editar pet'>
            <button
              className='text-lg text-default-400 cursor-pointer active:opacity-50'
              onClick={handleEdit}
            >
              <AiFillEdit />
            </button>
          </Tooltip>
          {isPendingDelete ? (
            <Spinner size='sm' />
          ) : (
            <Tooltip color='danger' content='Excluir pet'>
              <button
                className='text-lg text-danger cursor-pointer active:opacity-50'
                onClick={() => handleDelete(pet.id)}
              >
                <AiFillDelete />
              </button>
            </Tooltip>
          )}
        </div>
      );
  }
}

import { OwnerType } from '@/types/owner';
import { Spinner } from '@heroui/spinner';
import { Tooltip } from '@heroui/tooltip';
import { Key } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaPaw } from 'react-icons/fa6';

interface Props {
  owner: OwnerType;
  columnKey: Key;
  handleDelete: (ownerId: string) => void;
  isPendingDelete?: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
}

export function RowItem({
  owner,
  columnKey,
  handleDelete,
  isPendingDelete,
  onToggleExpand,
  onEdit,
}: Props) {
  switch (columnKey) {
    case 'name':
      return (
        <div className='flex items-center justify-start gap-2'>
          <p className='text-bold text-sm capitalize'>{owner.name}</p>
        </div>
      );
    case 'external_id':
      return <p className='text-bold text-sm capitalize text-center'>{owner.external_id}</p>;

    default:
      return (
        <div className='relative flex items-center justify-center gap-6'>
          <Tooltip content='Mais informações'>
            <button
              className='text-lg text-default-400 cursor-pointer active:opacity-50'
              onClick={() => onToggleExpand()}
            >
              <FaPaw />
            </button>
          </Tooltip>
          <Tooltip content='Editar tutor'>
            <button
              className='text-lg text-default-400 cursor-pointer active:opacity-50'
              onClick={() => onEdit()}
            >
              <AiFillEdit />
            </button>
          </Tooltip>
          {isPendingDelete ? (
            <Spinner size='sm' />
          ) : (
            <Tooltip color='danger' content='Excluir tutor'>
              <button
                className='text-lg text-danger cursor-pointer active:opacity-50'
                onClick={() => handleDelete(owner.id)}
              >
                <AiFillDelete />
              </button>
            </Tooltip>
          )}
        </div>
      );
  }
}

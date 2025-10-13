import { Tooltip } from '@heroui/tooltip';
import { DateTime } from 'luxon';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';

interface Props {
  user: { [x: string]: any };
  columnKey: string | number;
}

export function RowItem({ user, columnKey }: Props) {
  const cellValue = user[columnKey];

  switch (columnKey) {
    case 'id':
      return <p className='text-bold text-sm capitalize'>{cellValue}</p>;
    case 'exam_type':
      return (
        <div className='flex items-center justify-start gap-2'>
          <p className='text-bold text-sm capitalize'>{cellValue}</p>
        </div>
      );
    case 'date':
      return (
        <p className='text-bold text-sm capitalize text-center'>
          {DateTime.fromFormat(cellValue, 'yyyy-MM-dd').toFormat('dd/MM/yyyy')}
        </p>
      );
    case 'specie':
      return <p className='text-bold text-sm capitalize'>{cellValue}</p>;
    case 'pet_name':
      return <p className='text-bold text-sm capitalize'>{cellValue}</p>;
    case 'owner':
      return <p className='text-bold text-sm capitalize'>{cellValue}</p>;
    case 'vet':
      return <p className='text-bold text-sm capitalize'>{cellValue}</p>;

    case 'actions':
      return (
        <div className='relative flex items-center justify-center gap-6'>
          <Tooltip content='Details'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <AiFillEye />
            </span>
          </Tooltip>
          <Tooltip content='Edit user'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <AiFillEdit />
            </span>
          </Tooltip>
          <Tooltip color='danger' content='Delete user'>
            <span className='text-lg text-danger cursor-pointer active:opacity-50'>
              <AiFillDelete />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
}

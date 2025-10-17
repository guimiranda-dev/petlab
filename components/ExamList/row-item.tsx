import { ExamInterface } from '@/types/exam';
import { ExamType } from '@/types/exam_types';
import { Tooltip } from '@heroui/tooltip';
import { DateTime } from 'luxon';
import { Key } from 'react';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';

interface Props {
  exam: ExamInterface;
  columnKey: Key;
}

export function RowItem({ exam, columnKey }: Props) {
  switch (columnKey) {
    case 'exam_type':
      return (
        <div className='flex items-center justify-start gap-2'>
          <p className='text-bold text-sm capitalize'>{ExamType[exam.exam_type]}</p>
        </div>
      );
    case 'date':
      return (
        <p className='text-bold text-sm capitalize text-center'>
          {DateTime.fromISO(exam.date).toFormat('dd/MM/yyyy')}
        </p>
      );
    case 'specie':
      return (
        <p className='text-bold text-sm capitalize'>
          {exam.pet.specie}/{exam.pet.breed}
        </p>
      );
    case 'pet_name':
      return <p className='text-bold text-sm capitalize'>{exam.pet.name}</p>;
    case 'owner':
      return <p className='text-bold text-sm capitalize'>{exam.pet.owner.name}</p>;
    case 'vet':
      return <p className='text-bold text-sm capitalize'>{exam.vet.name}</p>;

    default:
      return (
        <div className='relative flex items-center justify-center gap-6'>
          <Tooltip content='Details'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <AiFillEye />
            </span>
          </Tooltip>
          <Tooltip content='Editar exame'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <AiFillEdit />
            </span>
          </Tooltip>
          <Tooltip color='danger' content='Excluir exame'>
            <span className='text-lg text-danger cursor-pointer active:opacity-50'>
              <AiFillDelete />
            </span>
          </Tooltip>
        </div>
      );
  }
}

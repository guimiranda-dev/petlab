import { generatePdf } from '@/services/generatePdf';
import { ExamInterface } from '@/types/exam';
import { ExamType } from '@/types/exam_types';
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { Tooltip } from '@heroui/tooltip';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { Key } from 'react';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import { MdCheck, MdError } from 'react-icons/md';

interface Props {
  exam: ExamInterface;
  columnKey: Key;
  handleDelete: (examId: string) => void;
  isPendingDelete?: boolean;
}

export function RowItem({ exam, columnKey, handleDelete, isPendingDelete }: Props) {
  const router = useRouter();
  const handleGeneratePdf = async () => {
    try {
      await generatePdf(exam.id);

      addToast({
        icon: <MdCheck className='text-white' />,
        description: 'PDF gerado com sucesso!',
        color: 'success',
      });
    } catch (error) {
      addToast({
        icon: <MdError className='text-white' />,
        description: 'Erro ao gerar o PDF!',
        color: 'danger',
      });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/exam-form?id=${id}`);
  };

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
            <button
              className='text-lg text-default-400 cursor-pointer active:opacity-50'
              type='button'
              onClick={handleGeneratePdf}
            >
              <AiFillEye />
            </button>
          </Tooltip>
          <Tooltip content='Editar exame'>
            <button
              className='text-lg text-default-400 cursor-pointer active:opacity-50'
              onClick={() => handleEdit(exam.id)}
            >
              <AiFillEdit />
            </button>
          </Tooltip>
          {isPendingDelete ? (
            <Spinner size='sm' />
          ) : (
            <Tooltip color='danger' content='Excluir exame'>
              <button
                className='text-lg text-danger cursor-pointer active:opacity-50'
                onClick={() => handleDelete(exam.id)}
              >
                <AiFillDelete />
              </button>
            </Tooltip>
          )}
        </div>
      );
  }
}

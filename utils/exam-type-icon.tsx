import { ExamType } from '@/types/exam_types';
import { FaDroplet, FaFlask, FaVial, FaPrescriptionBottle } from 'react-icons/fa6';

export function examTypeIcon(examType: ExamType) {
  const icon = {
    [ExamType.hemograma]: <FaDroplet className='text-red-500' />,
    [ExamType.coproparasitologico]: <FaPrescriptionBottle className='text-blue-500' />,
    [ExamType.bioquimico]: <FaFlask className='text-green-500' />,
    [ExamType.urinalise]: <FaVial className='text-yellow-500' />,
  };

  return icon[examType];
}

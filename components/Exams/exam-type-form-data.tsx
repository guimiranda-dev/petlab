import { Link } from '@heroui/link';
import { Select, SelectItem } from '@heroui/select';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { ExamFormData } from './exam-form-data';
import { ExamType } from '@/types/exam_types';

const exams: { key: ExamType; label: string }[] = Object.entries(ExamType).map(([key, value]) => ({
  key: key as ExamType,
  label: value,
}));

interface Props {
  setFieldValue: (field: string, value: any) => void;
  touched: { [key: string]: any };
  values: { [key: string]: any };
  errors: { [key: string]: any };
}

export function ExamTypeFormData({ setFieldValue, touched, values, errors }: Props) {
  const addExam = () => {
    const newExams = [...values.exams, { type: null }];
    setFieldValue('exams', newExams);
  };

  const deleteExam = (index: number) => {
    const newExams = values.exams.filter((_: any, i: number) => i !== index);
    setFieldValue('exams', newExams);
  };

  return (
    <div className='space-y-4'>
      {values.exams.map((exame: { type: ExamType | null }, index: number) => (
        <div key={index}>
          <div className='flex items-center justify-center gap-2'>
            <Select
              isClearable
              label='Tipo do exame'
              placeholder='Selecione uma opção'
              selectedKeys={exame.type ? [exame.type] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFieldValue(`exams.${index}.type`, selectedKey);
              }}
            >
              {exams.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>

            <div className='flex gap-2'>
              {values.exams.length > 1 && (
                <Link
                  isBlock
                  color='danger'
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    deleteExam(index);
                  }}
                >
                  <AiOutlineMinusCircle className='text-danger-500' />
                </Link>
              )}
            </div>
          </div>

          {exame.type && <ExamFormData examType={exame.type} />}

          {index === values.exams.length - 1 && (
            <Link isBlock color='primary' className='mt-4' href='#' onPress={addExam}>
              <AiOutlinePlusCircle className='mr-2' />
              Adicionar exame
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

import { Select, SelectItem } from '@heroui/select';
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

export function ExamTypeFormData({ setFieldValue, values, errors }: Props) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center gap-2'>
        <Select
          isClearable
          label='Tipo do exame'
          placeholder='Selecione uma opção'
          selectedKeys={values.exams?.type ? [values.exams.type] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFieldValue(`exams.type`, selectedKey);
          }}
        >
          {exams.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>
      </div>

      {values.exams.type && (
        <ExamFormData examType={values.exams.type} setFieldValue={setFieldValue} values={values} />
      )}

      {errors?.exams?.type && (
        <span className='text-danger-500 text-sm'>{errors?.exams?.type}</span>
      )}

      {!errors?.exams?.type && errors?.exams?.values && (
        <span className='text-danger-500 text-sm'>{errors?.exams?.values}</span>
      )}
    </div>
  );
}

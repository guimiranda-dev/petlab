import { useEffect, useMemo } from 'react';
import { useExamsReferenceValuesQuery } from '@/hooks/useExamsReferenceValuesQuery.hook';
import { ExamReferenceValues } from '@/types/exam_reference_values';
import { ExamSubgroup } from '@/types/exam_subgroup';
import { ExamType } from '@/types/exam_types';
import { Input } from '@heroui/input';

interface Props {
  examType: ExamType;
  setFieldValue: (field: string, value: any) => void;
  values: { [key: string]: any };
}

function groupBySubgroup(data: ExamReferenceValues[]) {
  const grouped = data.reduce(
    (acc, item) => {
      const subgroupName = item.exam_subgroup;

      if (!acc[subgroupName]) {
        acc[subgroupName] = [];
      }

      acc[subgroupName].push(item);
      return acc;
    },
    {} as Record<string, ExamReferenceValues[]>,
  );

  return grouped;
}

export function ExamFormData({ examType, setFieldValue, values }: Props) {
  const { data, isFetching } = useExamsReferenceValuesQuery(examType);

  const groupedData = useMemo(() => {
    if (!data?.data) return {};
    return groupBySubgroup(data.data);
  }, [data?.data]);

  useEffect(() => {
    if (!data?.data) return;

    let key_reference = '';
    let key_relative = '';

    let isAdult = false;

    if (values?.pet?.specie === 'Felino') {
      // Felinos não tem exames adultos/filhotes
      key_reference += 'cat_';
      key_relative += 'cat_';
    } else if (values?.pet?.birth_date && values?.pet?.specie === 'Canino') {
      // Caninos tem exames adultos/filhotes
      const birthDate = new Date(values?.pet?.birth_date);
      const today = new Date();
      const ageInMilliseconds = today.getTime() - birthDate.getTime();
      const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);
      isAdult = ageInDays >= 90;
      key_reference = `${isAdult ? 'adult' : 'puppy'}_dog_`;
      key_relative = `${isAdult ? 'adult' : 'puppy'}_dog_`;
    }

    key_reference += 'reference';
    key_relative += 'reference_relative';

    Object.entries(groupedData).forEach(([_, exams]) => {
      exams.forEach((exam) => {
        const value = (exam[key_reference as keyof ExamReferenceValues] as string) || null;
        const valueRelative = (exam[key_relative as keyof ExamReferenceValues] as string) || null;

        setFieldValue(`exams.values.${exam.id}.reference_value`, value || null);
        setFieldValue(`exams.values.${exam.id}.reference_relative_value`, valueRelative || null);
        setFieldValue(`exams.values.${exam.id}.unit`, exam.unit);
        setFieldValue(`exams.values.${exam.id}.exam_reference_id`, exam.id);
        setFieldValue(`exams.values.${exam.id}.name`, exam.name);
        setFieldValue(`exams.values.${exam.id}.exam_subgroup`, exam.exam_subgroup);
      });
    });
  }, [data?.data, values.pet]);

  const handleReferenceValue = (examId: number) => {
    const absoluteValue = values?.exams?.values?.[examId]?.reference_value;
    const relativeValue = values?.exams?.values?.[examId]?.reference_relative_value;
    const unit = values?.exams?.values?.[examId]?.unit;

    if (absoluteValue === null && relativeValue === null) {
      return 'N/A';
    }

    if (relativeValue !== null) {
      return `${relativeValue} % | ${absoluteValue} ${unit}`;
    }

    return `${absoluteValue} ${unit}`;
  };

  if (!data?.data || isFetching) return null;

  return (
    <div className='mt-4'>
      {Object.entries(groupedData).map(([subgroupName, exams]) => (
        <div key={subgroupName} className='mt-4'>
          <span className='font-bold text-primary-500 text-lg my-2 ml-2'>
            {ExamSubgroup[subgroupName as keyof typeof ExamSubgroup]}
          </span>

          <div className='flex flex-col gap-2'>
            {exams.map((exam) => (
              <div key={exam.id}>
                <div className='grid grid-cols-5 gap-2'>
                  <div className='grid grid-cols-2 gap-2 col-span-3'>
                    {values?.exams?.values?.[exam.id]?.reference_relative_value && (
                      <Input
                        classNames={{
                          label: 'font-bold !text-secondary-500',
                        }}
                        label={exam.name}
                        placeholder='Digite aqui'
                        onChange={(e) => {
                          setFieldValue(`exams.values.${exam.id}.value`, Number(e.target.value));
                        }}
                        type='number'
                        endContent={<span className='text-[10px] text-secondary-500'>%</span>}
                      />
                    )}
                    <div
                      className={
                        !values?.exams?.values?.[exam.id]?.reference_relative_value
                          ? 'col-span-2'
                          : ''
                      }
                    >
                      <Input
                        classNames={{
                          label: 'font-bold !text-secondary-500',
                        }}
                        label={exam.name}
                        placeholder='Digite aqui'
                        onChange={(e) => {
                          setFieldValue(`exams.values.${exam.id}.value`, Number(e.target.value));
                        }}
                        type='number'
                        endContent={
                          <span className='text-[10px] text-secondary-500'>
                            {values?.exams?.values?.[exam.id]?.unit}
                          </span>
                        }
                      />
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <Input
                      label='Valor de referência'
                      placeholder='Digite aqui'
                      disabled
                      readOnly
                      value={handleReferenceValue(exam.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

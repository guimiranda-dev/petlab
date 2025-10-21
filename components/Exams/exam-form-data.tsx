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

    let key = '';

    let isAdult = false;
    if (values?.pet?.birth_date) {
      const birthDate = new Date(values?.pet?.birth_date);
      const today = new Date();
      const ageInMilliseconds = today.getTime() - birthDate.getTime();
      const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);
      isAdult = ageInDays >= 90;
    }

    key = `${isAdult ? 'adult' : 'puppy'}_`;

    if (values?.pet?.specie === 'Canino') {
      key += 'dog_';
    } else {
      key += 'cat_';
    }

    key += 'reference';

    Object.entries(groupedData).forEach(([_, exams]) => {
      exams.forEach((exam) => {
        const value = (exam[key as keyof ExamReferenceValues] as string) || 'N/A';

        setFieldValue(`exams.values.${exam.id}.reference_value`, value);
        setFieldValue(`exams.values.${exam.id}.exam_reference_id`, exam.id);
        setFieldValue(`exams.values.${exam.id}.name`, exam.name);
      });
    });
  }, [data?.data, values.pet]);

  if (!data?.data || isFetching) return null;

  return (
    <div className='mt-4'>
      {Object.entries(groupedData).map(([subgroupName, exams]) => (
        <div key={subgroupName} className='mt-4'>
          <span className='font-bold text-primary-500 text-lg my-2 ml-2'>
            {ExamSubgroup[subgroupName as keyof typeof ExamSubgroup]}
          </span>

          <div className='flex flex-col gap-2'>
            {exams.map((exam, idx) => (
              <div key={exam.id}>
                <div className='flex items-center justify-center gap-2'>
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
                  />
                  <Input
                    label='Valor de referência'
                    placeholder='Digite aqui'
                    disabled
                    readOnly
                    value={values?.exams?.values?.[exam.id]?.reference_value || 'N/A'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

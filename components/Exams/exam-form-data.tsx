import { useExamsReferenceValuesQuery } from '@/hooks/useExamsReferenceValuesQuery.hook';
import { ExamReferenceValues } from '@/types/exam_reference_values';
import { ExamSubgroup } from '@/types/exam_subgroup';
import { ExamType } from '@/types/exam_types';
import { Input } from '@heroui/input';

interface Props {
  examType: ExamType;
}

function groupBySubgroup(data: ExamReferenceValues[]) {
  const grouped = data.reduce(
    (acc, item) => {
      const subgroupName = item.exam_subgroup; // ou item.exam_subgroup dependendo da estrutura

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

export function ExamFormData({ examType }: Props) {
  const { data, isFetching } = useExamsReferenceValuesQuery(examType);

  if (!data?.data || isFetching) return null;

  const groupedData = groupBySubgroup(data.data);

  // Função para determinar qual valor de referência usar
  const getReferenceValue = (exam: ExamReferenceValues, animalType: string, ageGroup: string) => {
    const key = `${ageGroup}_${animalType}_reference` as keyof ExamReferenceValues;
    return (exam[key] as string) || 'N/A';
  };

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
                <div className='flex items-center justify-center gap-2'>
                  <Input
                    classNames={{
                      label: 'font-bold !text-secondary-500',
                    }}
                    label={exam.name}
                    placeholder='Digite aqui'
                  />
                  <Input
                    label='Valor de referência'
                    placeholder='Digite aqui'
                    disabled
                    readOnly
                    value={getReferenceValue(exam, 'dog', 'adult')}
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

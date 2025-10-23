import { ExamFormProps, ExamInterface } from '@/types/exam';
import { createClient } from '@/utils/supabase/client';
import { verifyIfIsAdult } from '@/utils/verifyIfIsAdult';
import { pdf } from '@react-pdf/renderer';
import { DateTime } from 'luxon';
import PDFHemograma from '../components/PDFExam/hemograma';
import PDFBioquimico from '../components/PDFExam/bioquimico';
import { ExamType } from '@/types/exam_types';

type ReferenceKey =
  | 'adult_cat_reference'
  | 'adult_dog_reference'
  | 'puppy_cat_reference'
  | 'puppy_dog_reference';

type RelativeKey =
  | 'adult_cat_reference_relative'
  | 'adult_dog_reference_relative'
  | 'puppy_cat_reference_relative'
  | 'puppy_dog_reference_relative';

export async function generatePdf(examId: string) {
  const supabase = createClient();

  const response = await supabase
    .from('exam')
    .select(
      `
      *,
      vet:vet(*),
      pet:pet(
        *,
        owner:owner(name, id)
      ),
      exam_values(*, exam_reference_values(*))
    `,
    )
    .eq('id', examId)
    .single();

  if (response.error) {
    throw response.error;
  }

  const data = response.data as ExamInterface | null;

  if (data) {
    const isAdult = verifyIfIsAdult(new Date(data.pet.birth_date), new Date(data.date));
    let key_reference: ReferenceKey;
    let key_relative: RelativeKey;

    if (isAdult) {
      if (data.pet.specie === 'Felino') {
        key_reference = 'adult_cat_reference';
        key_relative = 'adult_cat_reference_relative';
      } else if (data.pet.specie === 'Canino') {
        key_reference = 'adult_dog_reference';
        key_relative = 'adult_dog_reference_relative';
      }
    } else {
      if (data.pet.specie === 'Felino') {
        key_reference = 'puppy_cat_reference';
        key_relative = 'puppy_cat_reference_relative';
      } else if (data.pet.specie === 'Canino') {
        key_reference = 'puppy_dog_reference';
        key_relative = 'puppy_dog_reference_relative';
      }
    }

    const PDFData: ExamFormProps = {
      date: data.date,
      pet_id: data.pet_id,
      vet_id: data.vet_id,
      owner_id: data.pet.owner_id,
      owner: data.pet.owner,
      pet: data.pet,
      exams: {
        type: data.exam_type,
        values: data.exam_values.map((i) => ({
          name: i.exam_reference_values.name,
          exam_subgroup: i.exam_reference_values.exam_subgroup,
          method: i.exam_reference_values.method,
          sample_type: i.exam_reference_values.sample_type,
          exam_reference_id: i.exam_reference_id,
          unit: i.exam_reference_values.unit,
          reference_value: i.exam_reference_values[key_reference],
          reference_relative_value: i.exam_reference_values[key_relative],
          relative_value: i.relative,
          value: i.value,
        })),
      },
    };

    const blob = await (data.exam_type === ExamType.hemograma
      ? pdf(<PDFHemograma values={PDFData} />).toBlob()
      : pdf(<PDFBioquimico values={PDFData} />).toBlob());

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exame_${data.pet.name}_${DateTime.fromISO(data.date).toFormat('dd-MM-yyyy')}.pdf`;
    link.click();

    URL.revokeObjectURL(url);

    return;
  }

  throw new Error('Erro ao gerar o PDF!');
}

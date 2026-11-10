import { ExamFormProps, ExamInterface } from '@/types/exam';
import { verifyIfIsAdult } from '@/utils/verifyIfIsAdult';
import PDFHemograma from '../components/PDFExam/hemograma';
import PDFBioquimico from '../components/PDFExam/bioquimico';
import PDFCoproparasitologico from '../components/PDFExam/coproparasitologico';
import PDFUrinalise from '../components/PDFExam/urinalise';
import PDFReticulocitos from '../components/PDFExam/reticulocitos';
import { ExamType } from '@/types/exam_types';

import { SupabaseClient } from '@supabase/supabase-js';
import { PDFAssets } from '@/components/PDFExam/assets';

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

export async function fetchExamForPdf(supabase: SupabaseClient, examId: string) {
  const response = await supabase
    .from('exam')
    .select(
      `
      *,
      vet:vet(*),
      pet:pet(
        *,
        owner:owner(name, id, external_id)
      ),
      exam_values(*, exam_reference_values(*))
    `,
    )
    .eq('id', examId)
    .is('deleted_at', null)
    .maybeSingle();

  if (response.error) {
    throw response.error;
  }

  const data = response.data as ExamInterface | null;

  return data;
}

export function buildExamPdfData(data: ExamInterface): ExamFormProps {
  const isAdult = verifyIfIsAdult(new Date(data.pet.birth_date), new Date(data.date));
  let key_reference: ReferenceKey = 'puppy_dog_reference';
  let key_relative: RelativeKey = 'puppy_dog_reference_relative';

  const specie = data.pet.specie.toLowerCase();

  if (!['felino', 'felina', 'canino', 'canina'].includes(specie)) {
    throw new Error('Espécie do animal sem valores de referência.');
  }

  if (isAdult) {
    if (specie === 'felino' || specie === 'felina') {
      key_reference = 'adult_cat_reference';
      key_relative = 'adult_cat_reference_relative';
    } else if (specie === 'canino' || specie === 'canina') {
      key_reference = 'adult_dog_reference';
      key_relative = 'adult_dog_reference_relative';
    }
  } else {
    if (specie === 'felino' || specie === 'felina') {
      key_reference = 'puppy_cat_reference';
      key_relative = 'puppy_cat_reference_relative';
    } else if (specie === 'canino' || specie === 'canina') {
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
    vet: data.vet,
    obs: data.obs,
    exams: {
      type: data.exam_type,
      values: data.exam_values.map((i) => ({
        name: i.exam_reference_values.name,
        order: i.exam_reference_values.order,
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

  return PDFData;
}

export function createExamPdfDocument(values: ExamFormProps, assets?: PDFAssets) {
  if (!values.exams.type) throw new Error('Tipo de exame não informado.');
  const pdfByExamType = {
    [ExamType.hemograma]: <PDFHemograma values={values} assets={assets} />,
    [ExamType.bioquimico]: <PDFBioquimico values={values} assets={assets} />,
    [ExamType.coproparasitologico]: <PDFCoproparasitologico values={values} assets={assets} />,
    [ExamType.urinalise]: <PDFUrinalise values={values} assets={assets} />,
    [ExamType.reticulocitos]: <PDFReticulocitos values={values} assets={assets} />,
  };

  const pdfDocument = pdfByExamType[values.exams.type];

  if (!pdfDocument) {
    throw new Error(`Tipo de exame sem template de PDF: ${values.exams.type}`);
  }

  return pdfDocument;
}

export function getExamPdfFilename(data: ExamInterface) {
  const filePrefix = {
    [ExamType.hemograma]: 'H ',
    [ExamType.bioquimico]: 'B ',
    [ExamType.coproparasitologico]: 'C ',
    [ExamType.urinalise]: 'U ',
    [ExamType.reticulocitos]: 'R ',
  };

  let name = filePrefix[data.exam_type as keyof typeof filePrefix];
  name += `${data.pet.name.toUpperCase()} - `;
  name += `${data.pet.owner.name.toUpperCase()} ${data.pet.owner?.external_id || ''}`;
  return `${name}.pdf`;
}

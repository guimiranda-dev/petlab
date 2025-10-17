import * as yup from 'yup';

// Schema principal de validação
export const examValidationSchema = yup.object().shape({
  vet_id: yup
    .string()
    .required('Veterinário é obrigatório')
    .min(1, 'Veterinário não pode estar vazio'),
  pet_id: yup.string().required('Pet é obrigatório').min(1, 'Pet não pode estar vazio'),
  owner_id: yup.string().required('Tutor é obrigatório').min(1, 'Tutor não pode estar vazio'),
  date: yup
    .string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  exams: yup
    .object()
    .shape({
      type: yup.mixed().nullable().required('Tipo de exame é obrigatório'),
      values: yup
        .array()
        .of(
          yup.object().shape({
            exam_reference_id: yup.number().optional(),
            reference_value: yup.string().optional(),
            value: yup.number().optional(),
          }),
        )
        .test(
          'at-least-one-value',
          'Pelo menos um valor do exame deve ser preenchido',
          function (values) {
            if (!values || values.length === 0) return false;
            return values.some((item) => item.value !== undefined && item.value !== null);
          },
        )
        .required(),
    })
    .required('Exame é obrigatório'),
});

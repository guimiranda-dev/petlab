import * as yup from 'yup';

export const vetValidationSchema = yup.object().shape({
  name: yup.string().required('O nome do veterinário é obrigatório').trim(),
  cmv: yup.string().required('O CRMV é obrigatório').trim(),
});

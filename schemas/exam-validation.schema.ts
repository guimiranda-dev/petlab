import * as yup from 'yup';

// Schema de validação para cada item do array de exames
const examSchema = yup.object().shape({
  exam: yup
    .number()
    .required('Código do exame é obrigatório')
    .positive('Código do exame deve ser positivo')
    .integer('Código do exame deve ser um número inteiro'),
  value: yup.number().required('Valor é obrigatório').min(0, 'Valor não pode ser negativo'),
  relative: yup
    .number()
    .required('Valor relativo é obrigatório')
    .min(0, 'Valor relativo não pode ser negativo')
    .max(100, 'Valor relativo não pode ser maior que 100'),
  absolute: yup
    .number()
    .required('Valor absoluto é obrigatório')
    .min(0, 'Valor absoluto não pode ser negativo'),
});

// Schema principal de validação
export const examValidationSchema = yup.object().shape({
  vet_id: yup
    .string()
    .required('ID do veterinário é obrigatório')
    .min(1, 'ID do veterinário não pode estar vazio'),
  pet_id: yup.string().required('ID do pet é obrigatório').min(1, 'ID do pet não pode estar vazio'),
  date: yup
    .string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  exams: yup
    .array()
    .of(examSchema)
    .min(1, 'Pelo menos um exame deve ser informado')
    .required('Lista de exames é obrigatória'),
});

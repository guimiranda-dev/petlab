import * as yup from 'yup';

// Schema de validação para PetType
export const petValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome do pet é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim(),

  breed: yup
    .string()
    .required('Raça é obrigatória')
    .min(2, 'Raça deve ter pelo menos 2 caracteres')
    .max(50, 'Raça deve ter no máximo 50 caracteres')
    .trim(),

  specie: yup.string().required('Espécie é obrigatória').trim(),

  gender: yup.string().required('Gênero é obrigatório').trim(),

  birth_date: yup
    .string()
    .required('Data de nascimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .test('is-valid-date', 'Data de nascimento inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test('not-future', 'Data de nascimento não pode ser no futuro', (value) => {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      return birthDate <= today;
    })
    .test('reasonable-age', 'Data de nascimento muito antiga (mais de 50 anos)', (value) => {
      if (!value) return false;
      const birthDate = new Date(value);
      const fiftyYearsAgo = new Date();
      fiftyYearsAgo.setFullYear(fiftyYearsAgo.getFullYear() - 50);
      return birthDate >= fiftyYearsAgo;
    }),
});

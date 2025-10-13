import * as yup from 'yup';

export const ownerValidationSchema = yup.object().shape({
  name: yup.string().required('O nome do tutor é obrigatório'),
});

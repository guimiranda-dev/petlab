'use client';

import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Link } from '@heroui/link';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { Select, SelectItem } from '@heroui/select';
import { Header } from '@/components/header';
import { OwnerFormData } from '@/components/Exams/owner-form-data';
import { useFormik } from 'formik';
import { examValidationSchema } from '@/schemas/exam-validation.schema';
import { PetFormData } from '@/components/Exams/pet-form-data';

const exams = [
  { key: 'Creatinina', label: 'Creatinina' },
  { key: 'Glóbulos Vermelhos', label: 'Glóbulos Vermelhos' },
  { key: 'Glóbulos Brancos', label: 'Glóbulos Brancos' },
];

const animals = [
  { key: 'Banguela', label: 'Banguela' },
  { key: 'Goose', label: 'Goose' },
  { key: 'Oliver', label: 'Oliver' },
];

const initialValues = {
  vet_id: '',
  pet_id: '',
  date: '',
  owner_id: '',
};

export default function Page() {
  const submit = () => {};

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: examValidationSchema,
    validateOnBlur: true,
  });

  return (
    <>
      <Header />
      <section className='container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 p-6 my-4 gap-6 bg-white rounded-md'>
        <div className='flex flex-col gap-4'>
          <div className='mb-6'>
            <h1 className='text-3xl text-slate-800 mb-0 font-bold'>
              Formulário de criação de exame
            </h1>
            <h2 className='text-lg text-slate-800'>
              Preencha as informações abaixo para gerar um novo exame
            </h2>
          </div>

          <div className='flex items-center justify-center gap-2'>
            <OwnerFormData
              errors={errors}
              setFieldValue={setFieldValue}
              touched={touched}
              values={values}
            />

            <PetFormData
              errors={errors}
              setFieldValue={setFieldValue}
              touched={touched}
              values={values}
            />
          </div>

          <Divider className='my-4' />

          <div className='flex items-center justify-center gap-2'>
            <Select className='max-w-xs' label='Tipo do exame' placeholder='Selecione uma opção'>
              {exams.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Input label='Valor do exame' placeholder='Digite aqui' />
            <Input label='Valor de referência' placeholder='Digite aqui' />

            <div>
              <Link isBlock color='danger' href='#'>
                <AiOutlineMinusCircle className='text-danger-500' />
              </Link>
            </div>
          </div>

          <div>
            <Link isBlock color='primary' href='#'>
              <AiOutlinePlusCircle className='mr-2' />
              Adicionar exame
            </Link>
          </div>
        </div>

        <div className='p-4 w-full'>
          <Card className='w-full'>
            <CardBody>
              <p>Make beautiful websites regardless of your design experience.</p>
            </CardBody>
          </Card>
        </div>
      </section>
    </>
  );
}

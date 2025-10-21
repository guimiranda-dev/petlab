'use client';

import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Select, SelectItem } from '@heroui/select';
import { Header } from '@/components/header';
import { OwnerFormData } from '@/components/Exams/owner-form-data';
import { useFormik } from 'formik';
import { examValidationSchema } from '@/schemas/exam-validation.schema';
import { PetFormData } from '@/components/Exams/pet-form-data';
import { Button } from '@heroui/button';
import { useVetQuery } from '@/hooks/useVetQuery.hook';
import { ExamTypeFormData } from '@/components/Exams/exam-type-form-data';
import { addToast } from '@heroui/toast';
import { FaCircleCheck, FaSpinner } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';
import { ExamValuesRequest, useExamMutation } from '@/hooks/useExamMutation.hook';
import { useRouter } from 'next/navigation';
import PDFFile from '@/utils/pdfFile';
import { Document, PDFViewer, usePDF } from '@react-pdf/renderer';
import { ExamFormProps } from '@/types/exam';
import { useEffect, useState } from 'react';
import { Spinner } from '@heroui/spinner';

const initialValues: ExamFormProps = {
  pet: null,
  owner: null,
  vet_id: '',
  pet_id: '',
  date: '',
  owner_id: '',
  exams: {
    type: null,
    values: [],
  },
};

export default function Page() {
  const { data, isFetching } = useVetQuery();
  const router = useRouter();

  const onSuccess = () => {
    router.replace('/exams-list');

    addToast({
      icon: <FaCircleCheck className='text-success' />,
      description: 'Exame criado com sucesso!',
    });
  };

  const onError = (e: Error) => {
    console.error(e);
    addToast({
      icon: <MdError className='text-white' />,
      description: 'Erro ao criar o exame!',
      color: 'danger',
    });
  };

  const { mutate, isPending } = useExamMutation({ onSuccess, onError });

  const submit = (v: ExamFormProps) => {
    const examValues: ExamValuesRequest[] = [];
    v.exams.values.map((i) => {
      if (i && i.value) {
        // Valores vazios não serão salvos
        examValues.push({
          exam_id: 0,
          exam_reference_id: i.exam_reference_id,
          reference_value: i.reference_value,
          value: i.value,
        });
      }
    });

    mutate({
      exam: {
        date: v.date,
        pet_id: v.pet_id,
        vet_id: v.vet_id,
        exam_type: v.exams.type,
      },
      examValues: examValues,
    });
  };

  const { values, setFieldValue, handleSubmit, errors, touched, setFieldTouched } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: examValidationSchema,
    validateOnBlur: true,
  });

  const [debouncedValues, setDebouncedValues] = useState(values);
  const [instance, updateInstance] = usePDF({
    document: <PDFFile values={debouncedValues} />,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(values);
    }, 500); // Aguarda 500ms após última mudança

    return () => clearTimeout(timer);
  }, [values]);

  useEffect(() => {
    updateInstance(<PDFFile values={debouncedValues} />);
  }, [debouncedValues]);

  return (
    <>
      <Header />
      <section className='container mx-auto max-w-[1800px] min-h-screen grid grid-cols-1 md:grid-cols-2 p-6 my-4 gap-6 bg-white rounded-md'>
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
            <Input
              fullWidth
              type='date'
              label='Data do exame'
              onChange={(e) => setFieldValue('date', e.target.value)}
              onBlur={() => setFieldTouched('date', true)}
              errorMessage={touched.date && errors.date ? errors.date : ''}
              isInvalid={touched.date && !!errors.date}
              value={values.date}
              isRequired
            />
            <Select
              label='Veterinário'
              placeholder='Selecione o veterinário'
              selectedKeys={values.vet_id ? [values.vet_id] : []}
              onChange={(e) => setFieldValue('vet_id', e.target.value)}
              onBlur={() => setFieldTouched('vet_id', true)}
              errorMessage={touched.vet_id && errors.vet_id ? errors.vet_id : ''}
              isInvalid={touched.vet_id && !!errors.vet_id}
              isRequired
              items={data?.data || []}
              isLoading={isFetching}
            >
              {(option) => <SelectItem key={option.id}>{option.name}</SelectItem>}
            </Select>
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

          <Divider className='my-1' />

          {values.pet && (
            <ExamTypeFormData
              errors={errors}
              setFieldValue={setFieldValue}
              touched={touched}
              values={values}
            />
          )}

          {isPending ? (
            <div className='flex w-full items-center justify-center'>
              <FaSpinner className='animate-spin text-foreground-500' />
            </div>
          ) : (
            <Button type='button' color='primary' onPress={() => handleSubmit()}>
              Salvar exame
            </Button>
          )}
        </div>

        <div className='p-4 w-full'>
          {instance.loading && (
            <div className='w-full h-full flex items-center justify-center bg-slate-100 absolute z-50 top-0'>
              <Spinner size='lg' />
            </div>
          )}
          {instance.url && !instance.loading && (
            <embed
              src={instance.url ? `${instance.url}#toolbar=0&navpanes=0&scrollbar=0` : ''}
              width='100%'
              height='100%'
            />
          )}
        </div>
      </section>
    </>
  );
}

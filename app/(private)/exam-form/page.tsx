'use client';

import { Input, Textarea } from '@heroui/input';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { ExamFormProps } from '@/types/exam';
import { ExamPreviewBioquimico } from '@/components/Exams/exam-preview-bioquimico';
import { ExamType } from '@/types/exam_types';
import { ExamPreviewHemograma } from '@/components/Exams/exam-preview-hemograma';
import { Suspense, useEffect } from 'react';
import { useExamByIdQuery } from '@/hooks/useExamByIdQuery.hook';
import { DateTime } from 'luxon';
import { useQueryClient } from '@tanstack/react-query';

const initialValues: ExamFormProps = {
  vet: null,
  pet: null,
  owner: null,
  vet_id: '',
  pet_id: '',
  date: '',
  owner_id: '',
  obs: '',
  exams: {
    type: null,
    values: [],
  },
};

function ExamFormContent() {
  const { data, isFetching } = useVetQuery();
  const router = useRouter();
  const params = useSearchParams();

  const queryClient = useQueryClient();

  const id = params.get('id');

  const { data: exam } = useExamByIdQuery(id);

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['exams'] });
    queryClient.invalidateQueries({ queryKey: ['exam-by-id', id] });
    router.replace('/exams-list');

    addToast({
      icon: <FaCircleCheck className='text-success' />,
      description: id ? 'Exame atualizado com sucesso!' : 'Exame criado com sucesso!',
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
          relative: i.relative_value,
        });
      }
    });

    mutate({
      exam: {
        date: v.date,
        pet_id: v.pet_id,
        vet_id: v.vet_id,
        exam_type: v.exams.type,
        obs: v.obs,
      },
      examValues: examValues,
      id: id,
    });
  };

  const { values, setFieldValue, handleSubmit, errors, touched, setFieldTouched, status } =
    useFormik({
      initialValues,
      enableReinitialize: true,
      onSubmit: submit,
      validationSchema: examValidationSchema,
      validateOnBlur: true,
    });

  const handleSelectVet = (value: string) => {
    setFieldValue('vet_id', value);

    const selected = data?.data.find((i) => String(i.id) === String(value));
    if (selected) {
      setFieldValue('vet', selected);
    } else {
      setFieldValue('vet', null);
    }
  };

  useEffect(() => {
    if (exam?.data) {
      setFieldValue('vet', exam.data.vet);
      setFieldValue('pet', exam.data.pet);
      setFieldValue('owner', exam.data.pet.owner);
      setFieldValue('vet_id', exam.data.vet_id);
      setFieldValue('obs', exam.data.obs || '');
      setFieldValue('date', DateTime.fromISO(exam.data.date).toFormat('yyyy-MM-dd'));
      setFieldValue('owner_id', exam.data.pet.owner_id);
      setTimeout(() => {
        setFieldValue('pet_id', exam.data?.pet_id);
      }, 2000);

      setFieldValue(`exams`, { type: exam.data.exam_type, values: [{}] });
    }
  }, [exam]);

  return (
    <>
      <Header />
      <section className='container mx-auto max-w-[1800px] min-h-screen grid grid-cols-1 md:grid-cols-2 p-6 my-4 gap-6 bg-white rounded-md'>
        <div className='flex flex-col gap-4 overflow-auto h-[calc(100vh-150px)]'>
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
              onChange={(e) => handleSelectVet(e.target.value)}
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
              examSaved={exam?.data || null}
            />
          )}

          <Textarea
            fullWidth
            label='Observações'
            onValueChange={(e) => setFieldValue('obs', e)}
            value={values.obs}
          />

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

        <div className='overflow-auto h-[calc(100vh-150px)] p-2'>
          {values.exams.type === ExamType.bioquimico && <ExamPreviewBioquimico values={values} />}
          {values.exams.type === ExamType.hemograma && <ExamPreviewHemograma values={values} />}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ExamFormContent />
    </Suspense>
  );
}

'use client';

import { useFormik } from 'formik';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { useQueryClient } from '@tanstack/react-query';
import { FaCircleCheck, FaSpinner } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { useEffect } from 'react';
import { VetType } from '@/types/vet';
import { useVetMutation } from '@/hooks/useVetMutation.hook';
import { vetValidationSchema } from '@/schemas/vet-validation.schema';

interface InitialValuesProps {
  name: string;
  cmv: string;
}

const initialValues: InitialValuesProps = {
  name: '',
  cmv: '',
};

interface Props {
  onClose: () => void;
  onSelect: (vet: VetType) => void;
  vet?: VetType;
}

export function NewVetForm({ onClose, onSelect, vet }: Props) {
  const queryClient = useQueryClient();

  const onSuccess = async (e: VetType) => {
    queryClient.setQueriesData({ queryKey: ['vets'] }, (oldData: any) => {
      if (!oldData) return { data: [e] };
      return {
        ...oldData,
        data: [e, ...(oldData.data || [])],
      };
    });

    await queryClient.invalidateQueries({ queryKey: ['vets'] });
    onSelect(e);
    onClose();
    addToast({
      icon: <FaCircleCheck className='text-success' />,
      description: 'Veterinário criado com sucesso!',
    });
  };

  const onError = (e: Error) => {
    addToast({
      icon: <MdError className='text-white' />,
      description: 'Erro ao criar o veterinário!',
      color: 'danger',
    });
  };

  const { mutate, isPending } = useVetMutation({ onSuccess, onError });

  function submit(formData: InitialValuesProps) {
    try {
      mutate({
        ...formData,
        id: vet?.id,
      });
    } catch (error) {
      console.error('Erro: ', error);
    }
  }

  const { values, setFieldValue, handleSubmit, errors, touched, setFieldTouched } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: vetValidationSchema,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (vet) {
      setFieldValue('name', vet.name);
      setFieldValue('cmv', vet.cmv);
    }
  }, [vet]);

  return (
    <Modal
      isOpen
      size='4xl'
      scrollBehavior='inside'
      backdrop='blur'
      isDismissable={false}
      onClose={onClose}
      portalContainer={document.body}
      aria-hidden={false}
    >
      <ModalContent className='shadow-sm bg-white' aria-hidden={false}>
        <ModalHeader>
          <div className='flex items-center gap-2'>
            <p className='text-lg font-semibold text-foreground'>Novo veterinário</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='relative mt-8'>
            <div className='mb-6'>
              <Input
                fullWidth
                label='Nome do veterinário'
                onChange={(e) => setFieldValue('name', e.target.value)}
                onBlur={() => setFieldTouched('name', true)}
                errorMessage={touched.name && errors.name ? errors.name : ''}
                isInvalid={touched.name && !!errors.name}
                value={values.name}
                placeholder='Ex: Gabrielle Shibata'
                isRequired
              />
            </div>

            <div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                fullWidth
                label='CRMV'
                onChange={(e) => setFieldValue('cmv', e.target.value)}
                onBlur={() => setFieldTouched('cmv', true)}
                errorMessage={touched.cmv && errors.cmv ? errors.cmv : ''}
                isInvalid={touched.cmv && !!errors.cmv}
                value={values.cmv}
                placeholder='Ex: 23824'
                isRequired
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className='justify-end'>
          {isPending ? (
            <div className='flex w-full items-center justify-center'>
              <FaSpinner className='animate-spin text-foreground-500' />
            </div>
          ) : (
            <>
              <Button type='button' variant='bordered' color='primary' onPress={onClose}>
                Cancelar
              </Button>
              <Button type='button' color='primary' onPress={() => handleSubmit()}>
                Salvar
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

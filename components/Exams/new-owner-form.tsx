'use client';
import { useFormik } from 'formik';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { useQueryClient } from '@tanstack/react-query';
import { FaCircleCheck, FaSpinner } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { ownerValidationSchema } from '@/schemas/owner-validation.schema';
import { addToast } from '@heroui/toast';
import { useOwnerMutation } from '@/hooks/useOwnerMutation.hook';
import { OwnerType } from '@/types/owner';

interface InitialValuesProps {
  name: string;
  external_id: string;
}

const initialValues: InitialValuesProps = {
  name: '',
  external_id: '',
};

interface Props {
  onClose: () => void;
  onSelect: (owner: OwnerType) => void;
}

export function NewOwnerForm({ onClose, onSelect }: Props) {
  const queryClient = useQueryClient();

  const onSuccess = async (e: OwnerType) => {
    queryClient.setQueriesData({ queryKey: ['owners'] }, (oldData: any) => {
      if (!oldData) return { data: [e] };
      return {
        ...oldData,
        data: [e, ...(oldData.data || [])],
      };
    });

    await queryClient.invalidateQueries({ queryKey: ['owners'] });
    onSelect(e);
    onClose();
    addToast({
      icon: <FaCircleCheck className='text-success' />,
      description: 'Tutor criado com sucesso!',
    });
  };

  const onError = (e: Error) => {
    addToast({
      icon: <MdError className='text-white' />,
      description: 'Erro ao criar o tutor!',
      color: 'danger',
    });
  };

  const { mutate, isPending } = useOwnerMutation({ onSuccess, onError });

  function submit(formData: InitialValuesProps) {
    try {
      mutate({
        ...formData,
      });
    } catch (error) {
      console.error('Erro: ', error);
    }
  }

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: ownerValidationSchema,
    validateOnBlur: true,
  });

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
            <p className='text-lg font-semibold text-foreground'>Novo tutor</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='relative mt-8'>
            <div className='mb-6'>
              <Input
                fullWidth
                label='Nome do tutor'
                onChange={(e) => setFieldValue('name', e.target.value)}
                errorMessage={touched.name && errors.name ? errors.name : ''}
                isInvalid={touched.name && !!errors.name}
                value={values.name}
                placeholder='Ex: João da Silva'
              />
            </div>

            <div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                fullWidth
                label='Código externo (Opcional)'
                onChange={(e) => setFieldValue('external_id', e.target.value)}
                errorMessage={touched.external_id && errors.external_id ? errors.external_id : ''}
                isInvalid={touched.external_id && !!errors.external_id}
                value={values.external_id}
                placeholder='Ex: 123456'
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

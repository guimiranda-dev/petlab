'use client';
import { useFormik } from 'formik';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { useQueryClient } from '@tanstack/react-query';
import { FaCircleCheck, FaSpinner } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { PetType } from '@/types/pet';
import { usePetMutation } from '@/hooks/usePetMutation.hook';
import { petValidationSchema } from '@/schemas/pet-validation.schema';
import { Select, SelectItem } from '@heroui/select';

const initialValues: Partial<PetType> = {
  name: '',
  breed: '',
  specie: '',
  gender: '',
  birth_date: '',
  external_id: '',
};

interface Props {
  onClose: () => void;
  owner_id: string;
  onSelect: (pet: PetType) => void;
}

const speciesOptions = [
  { value: 'Canino', label: 'Canino' },
  { value: 'Felino', label: 'Felino' },
];

const genderOptions = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Fêmea', label: 'Fêmea' },
];

export function NewPetForm({ onClose, owner_id, onSelect }: Props) {
  const queryClient = useQueryClient();

  const onSuccess = async (e: PetType) => {
    queryClient.setQueriesData({ queryKey: ['pets'] }, (oldData: any) => {
      if (!oldData) return { data: [e] };
      return {
        ...oldData,
        data: [e, ...(oldData.data || [])],
      };
    });

    await queryClient.invalidateQueries({ queryKey: ['pets'] });
    onSelect(e);
    onClose();
    addToast({
      icon: <FaCircleCheck className='text-success' />,
      description: 'Pet criado com sucesso!',
    });
  };

  const onError = (e: Error) => {
    addToast({
      icon: <MdError className='text-white' />,
      description: 'Erro ao criar o pet!',
      color: 'danger',
    });
  };

  const { mutate, isPending } = usePetMutation({ onSuccess, onError });

  function submit(formData: Partial<PetType>) {
    try {
      mutate({
        ...formData,
        owner_id,
      });
    } catch (error) {
      console.error('Erro: ', error);
    }
  }

  const { values, setFieldValue, handleSubmit, errors, touched, setFieldTouched } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: petValidationSchema,
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
            <p className='text-lg font-semibold text-foreground'>Novo pet</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='relative mt-4'>
            {/* Nome do Pet */}
            <div className='mb-4'>
              <Input
                fullWidth
                label='Nome do pet'
                onChange={(e) => setFieldValue('name', e.target.value)}
                onBlur={() => setFieldTouched('name', true)}
                errorMessage={touched.name && errors.name ? errors.name : ''}
                isInvalid={touched.name && !!errors.name}
                value={values.name}
                placeholder='Ex: Rex'
                isRequired
              />
            </div>

            {/* Grid com 2 colunas para Raça e Espécie */}
            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                fullWidth
                label='Raça'
                onChange={(e) => setFieldValue('breed', e.target.value)}
                onBlur={() => setFieldTouched('breed', true)}
                errorMessage={touched.breed && errors.breed ? errors.breed : ''}
                isInvalid={touched.breed && !!errors.breed}
                value={values.breed}
                placeholder='Ex: Labrador'
                isRequired
              />

              <Select
                label='Espécie'
                placeholder='Selecione a espécie'
                selectedKeys={values.specie ? [values.specie] : []}
                onChange={(e) => setFieldValue('specie', e.target.value)}
                onBlur={() => setFieldTouched('specie', true)}
                errorMessage={touched.specie && errors.specie ? errors.specie : ''}
                isInvalid={touched.specie && !!errors.specie}
                isRequired
              >
                {speciesOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Grid com 2 colunas para Gênero e Data de Nascimento */}
            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Select
                label='Gênero'
                placeholder='Selecione o gênero'
                selectedKeys={values.gender ? [values.gender] : []}
                onChange={(e) => setFieldValue('gender', e.target.value)}
                onBlur={() => setFieldTouched('gender', true)}
                errorMessage={touched.gender && errors.gender ? errors.gender : ''}
                isInvalid={touched.gender && !!errors.gender}
                isRequired
              >
                {genderOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>

              <Input
                fullWidth
                type='date'
                label='Data de nascimento'
                onChange={(e) => setFieldValue('birth_date', e.target.value)}
                onBlur={() => setFieldTouched('birth_date', true)}
                errorMessage={touched.birth_date && errors.birth_date ? errors.birth_date : ''}
                isInvalid={touched.birth_date && !!errors.birth_date}
                value={values.birth_date}
                isRequired
              />

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

'use client';
import { usePetsQuery } from '@/hooks/usePetsQuery.hook';
import { Link } from '@heroui/link';
import { Select, SelectItem } from '@heroui/select';
import { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { NewPetForm } from './new-pet-form';

interface Props {
  setFieldValue: (field: string, value: string) => void;
  touched: { [key: string]: any };
  values: { [key: string]: any };
  errors: { [key: string]: any };
}

export function PetFormData({ setFieldValue, touched, values, errors }: Props) {
  const [newPetFormShow, setNewPetFormShow] = useState(false);

  const { data, isFetching } = usePetsQuery({
    owner_id: values.owner_id,
  });

  return (
    <>
      <div className='w-full'>
        {isFetching ? (
          <div className='h-[56px] w-full animate-pulse rounded-lg bg-slate-200' />
        ) : (
          <Select
            label='Pet'
            placeholder='Selecione uma opção'
            selectedKeys={values.pet_id ? [values.pet_id] : []}
            onChange={(e) => setFieldValue('pet_id', e.target.value)}
            errorMessage={touched.pet_id && errors.pet_id ? errors.pet_id : ''}
            isInvalid={touched.pet_id && !!errors.pet_id}
            isRequired
          >
            {data
              ? data?.data.map((option) => (
                  <SelectItem key={option.id}>
                    {`${option.external_id} - ${option.name} - ${option.specie}/${option.breed}`}
                  </SelectItem>
                ))
              : null}
          </Select>
        )}

        <Link
          isBlock
          color='primary'
          href='#'
          className='py-2'
          onPress={() => {
            if (values.owner_id) {
              setNewPetFormShow(true);
            } else {
              alert('Selecione um tutor primeiro!');
            }
          }}
        >
          <AiOutlinePlusCircle className='mr-2' />
          Novo pet
        </Link>
      </div>
      {newPetFormShow && values.owner_id && (
        <NewPetForm onClose={() => setNewPetFormShow(false)} owner_id={values.owner_id} />
      )}
    </>
  );
}

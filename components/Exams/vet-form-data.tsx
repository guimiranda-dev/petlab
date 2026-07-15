'use client';

import { useVetQuery } from '@/hooks/useVetQuery.hook';
import { Select, SelectItem } from '@heroui/select';
import { useMemo, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Link } from '@heroui/link';
import { VetType } from '@/types/vet';
import { NewVetForm } from './new-vet-form';

interface Props {
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, isTouched?: boolean) => void;
  touched: { [key: string]: any };
  values: { [key: string]: any };
  errors: { [key: string]: any };
}

export function VetFormData({ setFieldValue, setFieldTouched, touched, values, errors }: Props) {
  const [newVetFormShow, setNewVetFormShow] = useState(false);

  const { data, isFetching } = useVetQuery();

  const vetsList = useMemo(() => {
    const list = data?.data || [];
    if (values.vet && !list.find((v) => String(v.id) === String(values.vet?.id))) {
      return [values.vet, ...list];
    }
    return list;
  }, [data?.data, values.vet]);

  const onVetSelect = (vet: VetType) => {
    setNewVetFormShow(false);
    setFieldValue('vet', vet);
    setFieldValue('vet_id', String(vet.id));
  };

  const handleSelect = (value: string) => {
    setFieldValue('vet_id', value);

    const selected = vetsList.find((i) => String(i.id) === String(value));
    if (selected) {
      setFieldValue('vet', selected);
    } else {
      setFieldValue('vet', null);
    }
  };

  return (
    <>
      <div className='w-full'>
        {isFetching ? (
          <div className='h-[56px] w-full animate-pulse rounded-lg bg-slate-200' />
        ) : (
          <Select
            label='Veterinário'
            placeholder='Selecione o veterinário'
            selectedKeys={values.vet_id ? [values.vet_id] : []}
            onChange={(e) => handleSelect(e.target.value)}
            onBlur={() => setFieldTouched('vet_id', true)}
            errorMessage={touched.vet_id && errors.vet_id ? errors.vet_id : ''}
            isInvalid={touched.vet_id && !!errors.vet_id}
            isRequired
            items={vetsList}
          >
            {(option) => <SelectItem key={option.id}>{option.name}</SelectItem>}
          </Select>
        )}

        <Link
          isBlock
          color='primary'
          href='#'
          className='py-2 mt-2'
          onPress={() => setNewVetFormShow(true)}
        >
          <AiOutlinePlusCircle className='mr-2' />
          Novo veterinário
        </Link>
      </div>

      {newVetFormShow && (
        <NewVetForm onClose={() => setNewVetFormShow(false)} onSelect={onVetSelect} />
      )}
    </>
  );
}

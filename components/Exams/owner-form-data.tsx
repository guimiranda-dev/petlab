import { Key, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import Autocomplete, { AutocompleteRef } from '../autocomplete';
import { useOwnersQuery } from '@/hooks/useOwnersQuery.hook';
import { NewOwnerForm } from './new-owner-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Link } from '@heroui/link';

interface Props {
  setFieldValue: (field: string, value: any) => void;
  touched: { [key: string]: any };
  values: { [key: string]: any };
  errors: { [key: string]: any };
}

export function OwnerFormData({ setFieldValue, touched, values, errors }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [filterValue, setFilterValue] = useState<string>(values.owner_id || '');
  const [inputValue, setInputValue] = useState<string>('');
  const [newOwnerFormShow, setNewOwnerFormShow] = useState(false);

  const autocompleteRef = useRef<AutocompleteRef>(null);

  const previousOwnerRef = useRef<string>('');

  useEffect(() => {
    if (values.owner_id && values.owner_id !== previousOwnerRef.current) {
      setFilterValue(values.owner_id);
      previousOwnerRef.current = values.owner_id;
    }
  }, [values.owner_id]);

  const debouncedSearch = useCallback(
    _.debounce((value: string) => {
      setFilterValue(value);
    }, 500),
    [],
  );

  const { data, isFetching } = useOwnersQuery({
    limit: 20,
    currentPage: 1,
    keyword: String(filterValue),
  });

  const onSelectionChange = (e: Key | null) => {
    if (data?.data) {
      const selected = data.data.find((i) => i.id === e);
      if (selected) {
        setFieldValue('owner', selected);
        setFieldValue('owner_id', String(selected.id));
      } else {
        setFieldValue('owner_id', '');
        setFieldValue('owner', '');
      }
    } else {
      setFieldValue('owner_id', '');
      setFieldValue('owner', '');
    }

    setFieldValue('pet_id', '');
  };

  useEffect(() => {
    debouncedSearch(filterValue);
  }, [filterValue]);

  useEffect(() => {
    if (data?.data && data?.data?.length > 0 && values.owner_id) {
      const selected = data.data.find((i) => i.id === values.owner_id);
      if (selected) {
        setInputValue(`${selected.id} - ${selected.name}`);

        setTimeout(() => {
          setLoaded(true);
        }, 500);
      } else {
        setTimeout(() => {
          setLoaded(true);
        }, 500);
      }
    } else {
      setTimeout(() => {
        setLoaded(true);
      }, 500);
    }
  }, [data]);

  return (
    <>
      <div className='w-full'>
        {!loaded ? (
          <div className='h-[56px] w-full animate-pulse rounded-lg bg-slate-200' />
        ) : (
          <Autocomplete
            ref={autocompleteRef}
            placeholder='Selecione uma opção'
            isInvalid={touched.owner_id && !!errors.owner_id}
            errorMessage={touched.owner_id && errors.owner_id ? errors.owner_id : ''}
            defaultItems={
              data?.data?.map((i) => ({
                key: String(i.id),
                label: `${i.external_id ? `${i.external_id} - ` : ''} ${i.name}`,
              })) || []
            }
            onSelectionChange={onSelectionChange}
            onInputChange={(v) => {
              setInputValue(v);
              setFilterValue(v);
            }}
            isLoading={isFetching}
            containerClassName='w-full'
            className='w-full'
            label='Tutor'
            selectedKey={values.owner_id}
            inputValue={inputValue}
            listboxProps={{
              emptyContent: (
                <div className='flex flex-col gap-2'>
                  <span className='text-sm text-muted'>Nenhum tutor encontrado</span>
                </div>
              ),
            }}
          />
        )}

        <Link
          isBlock
          color='primary'
          href='#'
          className='py-2 mt-2'
          onPress={() => setNewOwnerFormShow(true)}
        >
          <AiOutlinePlusCircle className='mr-2' />
          Novo tutor
        </Link>
      </div>

      {newOwnerFormShow && <NewOwnerForm onClose={() => setNewOwnerFormShow(false)} />}
    </>
  );
}

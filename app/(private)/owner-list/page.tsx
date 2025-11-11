'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { OwnerRequest, useOwnersQuery } from '@/hooks/useOwnersQuery.hook';
import { OwnerTableData } from '@/components/Owners/TableData';
import { SearchOwner } from '@/components/Owners/search';
import { NewOwnerForm } from '@/components/Exams/new-owner-form';
import { OwnerType } from '@/types/owner';

export default function Page() {
  const [totalPages, setTotalPages] = useState(1);
  const [searchProps, setSearchProps] = useState<OwnerRequest>({
    currentPage: 1,
    keyword: '',
    limit: 20,
  });
  const [showNewOwnerModal, setShowNewOwnerModal] = useState(false);
  const [ownerSelected, setOwnerSelected] = useState<OwnerType>();

  const { data, isFetching } = useOwnersQuery(searchProps);

  useEffect(() => {
    if (data?.count) {
      setTotalPages(Math.ceil(data.count / searchProps.limit));
    }
  }, [data?.count]);

  return (
    <>
      <Header />
      <section className='container mx-auto max-w-7xl p-6 bg-white my-4 rounded-md'>
        <div className='flex items-center justify-between my-4'>
          <h1 className='text-3xl text-slate-800 mb-0 font-bold'>Tutores</h1>
          <Button color='primary' onPress={() => setShowNewOwnerModal(true)}>
            Criar novo tutor
          </Button>
        </div>
        <SearchOwner
          onSearch={(v) => setSearchProps({ ...searchProps, ...v })}
          searchValues={searchProps}
        />
        {data && !isFetching && (
          <OwnerTableData
            data={data.data}
            page={searchProps.currentPage}
            setPage={(page) => setSearchProps({ ...searchProps, currentPage: page })}
            totalPages={totalPages}
            onEdit={(owner) => setOwnerSelected(owner)}
          />
        )}

        {isFetching && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
      </section>

      {(showNewOwnerModal || ownerSelected) && (
        <NewOwnerForm
          onClose={() => {
            setOwnerSelected(undefined);
            setShowNewOwnerModal(false);
          }}
          onSelect={() => null}
          owner={ownerSelected}
        />
      )}
    </>
  );
}

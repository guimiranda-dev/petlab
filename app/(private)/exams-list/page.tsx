'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { SearchExam } from '@/components/ExamList/search';
import { useRouter } from 'next/navigation';
import { ExamsRequest, useExamsQueryHook } from '@/hooks/useExamsQuery.hook';
import { ExamTableData } from '@/components/ExamList/TableData';
import { Spinner } from '@heroui/spinner';

export default function Page() {
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const [searchProps, setSearchProps] = useState<ExamsRequest>({
    currentPage: 1,
    keyword: '',
    limit: 20,
    type: null,
    endDate: null,
    startDate: null,
  });

  const { data, isFetching } = useExamsQueryHook(searchProps);

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
          <h1 className='text-3xl text-slate-800 mb-0 font-bold'>Exames</h1>
          <Button color='primary' onPress={() => router.push('/exam-form')}>
            Criar novo exame
          </Button>
        </div>
        <SearchExam
          onSearch={(v) => setSearchProps({ ...searchProps, ...v })}
          searchValues={searchProps}
        />
        {data && !isFetching && (
          <ExamTableData
            data={data.data}
            page={searchProps.currentPage}
            setPage={(page) => setSearchProps({ ...searchProps, currentPage: page })}
            totalPages={totalPages}
          />
        )}

        {isFetching && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
      </section>
    </>
  );
}

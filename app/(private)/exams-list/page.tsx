'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@heroui/button';
import { SearchExam } from '@/components/ExamList/search';
import { useRouter } from 'next/navigation';
import { useExamsQueryHook } from '@/hooks/useExamsQuery.hook';
import { ExamTableData } from '@/components/ExamList/TableData';

export default function Page() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const router = useRouter();

  const { data, isFetching } = useExamsQueryHook({
    currentPage: page,
    keyword: '',
    limit: 20,
    type: null,
  });

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
        <SearchExam onSearch={(value) => console.log(value)} />
        {data && !isFetching && (
          <ExamTableData data={data.data} page={page} setPage={setPage} totalPages={totalPages} />
        )}

        {isFetching && (
          <div className='flex justify-center items-center'>
            <span className='loading loading-spinner text-primary-500'></span>
          </div>
        )}
      </section>
    </>
  );
}

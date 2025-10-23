import { Spinner } from '@heroui/spinner';
import { usePDF } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import PDFFile from '../PDFExam/bioquimico';
import { ExamFormProps } from '@/types/exam';

interface Props {
  values: ExamFormProps;
}

export function ExamPreviewBioquimico({ values }: Props) {
  const [debouncedValues, setDebouncedValues] = useState(values);
  const [instance, updateInstance] = usePDF({
    document: <PDFFile values={debouncedValues} />,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(values);
    }, 500); // Aguarda 500ms após última mudança

    return () => clearTimeout(timer);
  }, [values]);

  useEffect(() => {
    updateInstance(<PDFFile values={debouncedValues} />);
  }, [debouncedValues]);

  return (
    <div className='p-4 w-full'>
      {instance.loading && (
        <div className='w-full h-full flex items-center justify-center bg-slate-100 absolute z-50 top-0'>
          <Spinner size='lg' />
        </div>
      )}
      {instance.url && !instance.loading && (
        <iframe
          src={instance.url ? `${instance.url}#toolbar=0&navpanes=0&scrollbar=0` : ''}
          width='100%'
          height='100%'
          allow='fullscreen'
        />
      )}
    </div>
  );
}

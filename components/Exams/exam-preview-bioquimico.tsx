import { Spinner } from '@heroui/spinner';
import { usePDF } from '@react-pdf/renderer';
import { memo, useEffect, useState } from 'react';
import PDFFile from '../PDFExam/bioquimico';
import { ExamFormProps } from '@/types/exam';

interface Props {
  values: ExamFormProps;
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const PdfBioquimicoView = memo(({ values }: Props) => {
  const [instance, updateInstance] = usePDF();

  useEffect(() => {
    updateInstance(<PDFFile values={values} />);
  }, [values, updateInstance]);

  return (
    <div className='p-4 w-full h-full'>
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
});
PdfBioquimicoView.displayName = 'PdfBioquimicoView';

export function ExamPreviewBioquimico({ values }: Props) {
  const debouncedValues = useDebouncedValue(values, 3000);
  return <PdfBioquimicoView values={debouncedValues} />;
}

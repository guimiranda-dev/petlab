import { useRef, useState } from 'react';
import { FaArrowUpFromBracket, FaImage, FaWandMagicSparkles } from 'react-icons/fa6';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { ExamFormProps } from '@/types/exam';
import {
  fieldForExamName,
  IMPORT_IMAGE_TYPES,
  MAX_IMPORT_BYTES,
  ProcessedColumn,
} from '@/utils/exam-image-import';

interface Props {
  values: ExamFormProps;
  setFieldValue: (field: string, value: any) => void;
}

export function ExamImageImport({ values, setFieldValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<ProcessedColumn[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const column = columns[Number(selected)];

  async function analyze() {
    if (!file || loading) return;
    setError('');
    setLoading(true);
    setColumns([]);
    setSelected('');
    setMessage('');
    try {
      const body = new FormData();
      body.append('image', file);
      const response = await fetch('/api/exams/import-image', { method: 'POST', body });
      if (!response.headers.get('content-type')?.includes('application/json'))
        throw new Error(
          'Sessão expirada ou serviço indisponível. Atualize a página e tente novamente.',
        );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro ao analisar a imagem.');
      setColumns(result.columns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar a imagem.');
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    if (selected === '' || !column) return;
    let count = 0;
    column.results.forEach((result) => {
      if (result.value === null && result.relative === null) return;
      const matches = values.exams.values.filter(
        (item) =>
          item && typeof item.name === 'string' && fieldForExamName(item.name) === result.field,
      );
      if (matches.length !== 1) return;
      const item = matches[0];
      if (result.value !== null)
        setFieldValue(`exams.values.${item.exam_reference_id}.value`, String(result.value));
      if (result.relative !== null)
        setFieldValue(
          `exams.values.${item.exam_reference_id}.relative_value`,
          String(result.relative),
        );
      count++;
    });
    if (!count) {
      setError(
        'Nenhum campo correspondente disponível. Aguarde os campos do hemograma ou confira o cadastro dos valores de referência.',
      );
      return;
    }
    if (column.observations) {
      setFieldValue('obs', [values.obs, column.observations].filter(Boolean).join('\n'));
    }
    setError('');
    setMessage('Resultados importados.');
  }

  return (
    <div className='space-y-4 rounded-xl border border-slate-200 bg-white p-4'>
      <label className='block text-sm font-semibold' htmlFor='exam-image'>
        Importar imagem do exame
      </label>
      <input
        id='exam-image'
        ref={fileInputRef}
        tabIndex={-1}
        aria-describedby='exam-image-help'
        type='file'
        accept={IMPORT_IMAGE_TYPES.join(',')}
        disabled={loading}
        className='sr-only'
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null;
          setColumns([]);
          setSelected('');
          setMessage('');
          if (
            next &&
            (!IMPORT_IMAGE_TYPES.includes(next.type) || next.size > MAX_IMPORT_BYTES || !next.size)
          ) {
            setError('Selecione uma imagem JPEG, PNG ou WebP de até 8 MB.');
            setFile(null);
          } else {
            setFile(next);
            setError('');
          }
        }}
      />
      <div className='flex flex-col gap-4 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-4 sm:flex-row sm:items-center'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600'>
            <FaImage className='text-xl' aria-hidden='true' />
          </div>
          <div className='min-w-0'>
            <p
              className='truncate text-sm font-semibold text-slate-800'
              title={file?.name}
              aria-live='polite'
            >
              {file ? file.name : 'Selecione a foto do exame'}
            </p>
            <p id='exam-image-help' className='mt-1 text-xs text-slate-500'>
              {file
                ? `${(file.size / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MB · Imagem selecionada`
                : 'JPEG, PNG ou WebP • Até 8 MB'}
            </p>
          </div>
        </div>
        <Button
          type='button'
          color='primary'
          variant='bordered'
          className='shrink-0 bg-white font-semibold'
          startContent={<FaArrowUpFromBracket aria-hidden='true' />}
          isDisabled={loading}
          onPress={() => fileInputRef.current?.click()}
        >
          {file ? 'Trocar imagem' : 'Selecionar imagem'}
        </Button>
      </div>
      <Button
        type='button'
        onPress={analyze}
        color='primary'
        fullWidth
        className='font-semibold'
        isLoading={loading}
        isDisabled={!file || loading}
        startContent={<FaWandMagicSparkles />}
      >
        Analisar imagem
      </Button>
      {error && (
        <p role='alert' className='text-sm text-danger-600'>
          {error}
        </p>
      )}
      {columns.length > 0 && (
        <Select
          label='Animal / tutor na imagem'
          placeholder='Selecione a coluna para importar'
          selectedKeys={selected ? [selected] : []}
          onChange={(event) => {
            setSelected(event.target.value);
            setMessage('');
          }}
        >
          {columns.map((item, index) => (
            <SelectItem
              key={String(index)}
            >{`Coluna ${index + 1}: ${item.animal || 'Animal ilegível'} / ${item.owner || 'Tutor ilegível'}`}</SelectItem>
          ))}
        </Select>
      )}
      {columns.length > 0 && (
        <Button
          type='button'
          color='primary'
          isDisabled={selected === '' || loading}
          onPress={apply}
        >
          Importar
        </Button>
      )}
      {message && (
        <p role='status' className='text-sm'>
          {message}
        </p>
      )}
    </div>
  );
}

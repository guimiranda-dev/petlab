/** Caderno -> campos do hemograma. Conversões são feitas aqui, nunca pelo modelo. */
export const notebookFields = {
  he: ['Hemácias', 'Hemacias', 'Eritrócitos'],
  hb: ['Hemoglobina'],
  ht: ['Hematócrito'],
  vcm: ['VCM'],
  hcm: ['HCM'],
  chcm: ['CHCM'],
  rdw: ['RDW'],
  leuc: ['Leucócitos totais', 'Leucócitos', 'Leucócitos total'],
  seg: ['Segmentados', 'Neutrófilos segmentados'],
  linf: ['Linfócitos'],
  eos: ['Eosinófilos'],
  mon: ['Monócitos'],
  plaq: ['Plaquetas'],
  pt: ['Proteína Plasmática Total', 'Proteínas Plasmáticas Totais', 'Proteína total', 'PPT'],
} as const;

export type NotebookField = keyof typeof notebookFields;
export interface ImportedColumn {
  animal: string | null;
  owner: string | null;
  observations: string | null;
  warnings: string[];
  readings: { field: string; raw: string | null }[];
}
export interface ImportedResult {
  field: NotebookField;
  raw: string | null;
  value: number | null;
  relative: number | null;
}
export interface ImportTargetField {
  id: number;
  name: string;
  unit: string;
  relative: boolean;
  options: string[];
}
export interface ImportedFieldResult {
  field: string;
  exam_reference_id: number;
  raw: string | null;
  value: string | null;
  relative: string | null;
}
export interface ProcessedColumn extends ImportedColumn {
  results: (ImportedResult | ImportedFieldResult)[];
}
export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
export const IMPORT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function normalizeExamName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function fieldForExamName(name: string): NotebookField | undefined {
  return (Object.keys(notebookFields) as NotebookField[]).find((key) =>
    notebookFields[key].some((alias) => normalizeExamName(alias) === normalizeExamName(name)),
  );
}

function numberFromText(raw: string | undefined): number | null {
  if (!raw?.trim()) return null;
  const text = raw.trim().replace(/\s/g, '').replace(/%$/, '');
  if (!/^\d+(?:[.,]\d+)?$/.test(text)) return null;
  const value = Number(text.replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

/** Formata os resultados para os campos do formulário, com vírgula decimal. */
export function formatImportedNumber(value: number): string {
  return String(value).replace('.', ',');
}

export function processColumn(column: ImportedColumn): ProcessedColumn {
  const warnings = [...column.warnings];
  const readings = new Map(column.readings.map((reading) => [reading.field, reading.raw]));
  const leucRaw = numberFromText(readings.get('leuc') ?? undefined);
  const leuc = leucRaw === null ? null : leucRaw * 1000;
  const results = (Object.keys(notebookFields) as NotebookField[]).map((field): ImportedResult => {
    const raw = readings.get(field) ?? null;
    const result: ImportedResult = { field, raw, value: null, relative: null };
    if (raw === null) {
      warnings.push(`${notebookFields[field][0]}: ausente ou ilegível; não preenchido.`);
      return result;
    }
    const parts = raw.split(/[\/|\\]/);
    if (['seg', 'linf', 'eos', 'mon'].includes(field)) {
      result.relative = numberFromText(parts[0]);
      if (result.relative !== null && result.relative > 100) {
        warnings.push(`${field}: percentual fora do intervalo de 0 a 100; conferir original.`);
        result.relative = null;
      }
      const calculated =
        leuc !== null && result.relative !== null
          ? Math.round((leuc * result.relative) / 100)
          : null;
      result.value = parts.length === 1 ? calculated : numberFromText(parts[1]);
      if (
        parts.length > 1 &&
        result.value !== null &&
        calculated !== null &&
        result.value !== calculated
      ) {
        warnings.push(
          `${field}: absoluto anotado (${result.value}) difere do calculado (${calculated}). Valor anotado preservado.`,
        );
      }
    } else if (field === 'plaq') {
      const platelets = numberFromText(parts[parts.length - 1]);
      result.value = platelets === null ? null : platelets * 1000;
    } else {
      result.value = field === 'leuc' ? leuc : numberFromText(raw);
    }
    if (result.value === null)
      warnings.push(`${field}: resultado ausente ou ilegível; conferir original (${raw}).`);
    return result;
  });
  return { ...column, warnings, results };
}

/** Valida também respostas de provedores que não aplicam integralmente o JSON Schema. */
export function parseImportResponse(input: unknown): ProcessedColumn[] {
  const data = input as { columns?: unknown[] };
  if (
    !data ||
    !Array.isArray(data.columns) ||
    data.columns.length === 0 ||
    data.columns.length > 20
  ) {
    throw new Error('Não foi possível identificar as colunas na imagem.');
  }
  return data.columns.map((item) => {
    const column = item as ImportedColumn;
    if (
      !column ||
      ![column.animal, column.owner, column.observations].every(
        (v) => v === null || typeof v === 'string',
      ) ||
      !Array.isArray(column.warnings) ||
      !column.warnings.every((v) => typeof v === 'string') ||
      !Array.isArray(column.readings) ||
      column.readings.length > 14 ||
      !column.readings.every(
        (r) =>
          r &&
          Object.hasOwn(notebookFields, r.field) &&
          (r.raw === null || typeof r.raw === 'string'),
      ) ||
      new Set(column.readings.map((r) => r.field)).size !== column.readings.length
    ) {
      throw new Error('A IA retornou dados inválidos. Tente outra imagem.');
    }
    return processColumn(column);
  });
}

/** Importa os campos cadastrados dos demais exames, incluindo resultados qualitativos. */
export function parseFieldImportResponse(
  input: unknown,
  fields: ImportTargetField[],
): ProcessedColumn[] {
  const data = input as { columns?: unknown[] };
  if (!data || !Array.isArray(data.columns) || !data.columns.length || data.columns.length > 20) {
    throw new Error('Não foi possível identificar as colunas na imagem.');
  }
  const targets = new Map(fields.map((field) => [String(field.id), field]));
  const nullableText = (value: unknown): value is string | null =>
    value === null || typeof value === 'string';
  const formatValue = (value: string | null) => {
    if (value === null) return null;
    const text = value.trim();
    if (!text) return null;
    return /^[+-]?\d+\.\d+$/.test(text) ? text.replace('.', ',') : text;
  };
  const normalizeOption = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  return data.columns.map((item) => {
    const column = item as Omit<ImportedColumn, 'readings'> & {
      readings: {
        field: string;
        raw: string | null;
        value: string | null;
        relative: string | null;
      }[];
    };
    if (
      !column ||
      ![column.animal, column.owner, column.observations].every(nullableText) ||
      !Array.isArray(column.warnings) ||
      !column.warnings.every((warning) => typeof warning === 'string') ||
      !Array.isArray(column.readings) ||
      column.readings.length > fields.length ||
      !column.readings.every(
        (reading) =>
          reading &&
          typeof reading.field === 'string' &&
          targets.has(reading.field) &&
          nullableText(reading.raw) &&
          nullableText(reading.value) &&
          nullableText(reading.relative),
      ) ||
      new Set(column.readings.map((reading) => reading.field)).size !== column.readings.length
    ) {
      throw new Error('A IA retornou dados inválidos. Tente outra imagem.');
    }
    const warnings = [...column.warnings];
    const results = column.readings.map((reading): ImportedFieldResult => {
      const target = targets.get(reading.field)!;
      let value = reading.raw === null ? null : formatValue(reading.value);
      if (value !== null && target.options.length) {
        const matches = target.options.filter(
          (option) => normalizeOption(option) === normalizeOption(value!),
        );
        value = matches.length === 1 ? matches[0] : null;
        if (value === null)
          warnings.push(`${target.name}: resultado sem opção correspondente no cadastro.`);
      }
      return {
        field: reading.field,
        exam_reference_id: target.id,
        raw: reading.raw,
        value,
        relative: reading.raw !== null && target.relative ? formatValue(reading.relative) : null,
      };
    });
    return { ...column, warnings, results };
  });
}

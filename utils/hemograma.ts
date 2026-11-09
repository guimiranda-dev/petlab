export function hasExamValue(value: unknown): boolean {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function getHemogramDefaultValue(name: string): string {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return ['metamelocitos', 'metamielocitos', 'bastonetes', 'basofilos'].includes(normalized)
    ? '0'
    : '';
}

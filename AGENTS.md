# Contexto do projeto: exames veterinários

Aplicação Next.js/React para gerenciamento de exames veterinários. Utiliza Supabase para persistência, React Query para dados assíncronos e `@react-pdf/renderer` para preview e download dos laudos.

## Fluxo de cadastro e laudo

1. Em `app/(private)/exam-form/page.tsx`, o usuário seleciona data, veterinário, tutor, pet e tipo de exame.
2. `components/Exams/exam-form-data.tsx` busca os itens na tabela Supabase `exam_reference_values`, filtrando por `exam_type`.
3. Os valores de referência são definidos conforme espécie (`Canino`/`Felino`) e faixa etária (adulto/filhote).
4. O formulário salva o cabeçalho em `exam` e os resultados preenchidos em `exam_values`, via `hooks/useExamMutation.hook.ts`.
5. O preview é renderizado no formulário com `usePDF`; a lista de exames chama `services/generatePdf.tsx` para criar e baixar o PDF no navegador.

## Tipos atualmente implementados de ponta a ponta

- `hemograma`
  - Preview: `components/Exams/exam-preview-hemograma.tsx`
  - PDF: `components/PDFExam/hemograma.tsx`
  - Agrupa itens por subgrupo; os subgrupos atuais em `types/exam_subgroup.ts` são Eritrograma e Leucograma.

- `bioquimico`
  - Preview: `components/Exams/exam-preview-bioquimico.tsx`
  - PDF: `components/PDFExam/bioquimico.tsx`
  - Exibe material e método por item do exame.

- `coproparasitologico`
  - Preview: `components/Exams/exam-preview-coproparasitologico.tsx`
  - PDF: `components/PDFExam/coproparasitologico.tsx`
  - Exibe os resultados preenchidos nas linhas cadastradas em `exam_reference_values`.

## Pontos de extensão e limitações atuais

- `types/exam_types.ts` já declara `reticulocitos`, `coproparasitologico` e `urinalise`, além de hemograma e bioquímico.
- `components/PDFExam/examReferences.tsx` já possui referências bibliográficas para esses três tipos adicionais.
- Ainda não existem preview nem templates de PDF específicos para `reticulocitos` e `urinalise`.
- `services/generatePdf.tsx` seleciona o template e prefixo de arquivo explicitamente por tipo. Ao adicionar exames, inclua-os nesse mapa para evitar que gerem um PDF incorreto.
- `app/(private)/exam-form/page.tsx` possui preview para hemograma, bioquímico e coproparasitológico; adicione o preview ao implementar outro tipo.
- A tela de entrada de resultados é genérica e orientada pelos registros de `exam_reference_values`; para um novo tipo, os valores de referência correspondentes precisam existir no Supabase.

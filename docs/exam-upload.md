# Envio de laudos ao SimplesVet

Configure `EXAM_UPLOAD_TOKEN` no ambiente do servidor (`.env.local` em desenvolvimento)
e reinicie a aplicação. Não use o prefixo `NEXT_PUBLIC_` para esse segredo.

Na listagem de exames, o botão **Enviar ao SimplesVet** abre uma confirmação com
animal, tutor e tipo de exame. O envio só começa após **Confirmar envio**.

`POST /api/exams/{id}/upload` requer uma sessão Supabase autenticada. A rota busca
o exame respeitando as políticas RLS e gera o mesmo laudo disponível para download,
com os arquivos locais de cabeçalho, logo e assinatura. O PDF fica em memória.

O servidor usa `fetch` e `FormData` para enviar ao endpoint:
`https://almanaque-chat-ai-870579198997.us-central1.run.app/integrations/simplesvet/exames`.

| Campo          | Origem                                                   |
| -------------- | -------------------------------------------------------- |
| `file`         | PDF gerado, com MIME `application/pdf`                   |
| `codigoAnimal` | `pet.external_id` (código numérico positivo obrigatório) |
| `tipoExame`    | `exam.exam_type`                                         |
| `laboratorio`  | `Petlab`                                                 |
| `dataExame`    | Data cadastrada no exame, em `YYYY-MM-DD`                |

Os headers são `Authorization: Bearer <EXAM_UPLOAD_TOKEN>` e
`Idempotency-Key: petlab-exame-{id}`. O boundary multipart é definido pelo `fetch`.
Não há reenvio automático. Tentativas manuais reutilizam a mesma chave; a deduplicação
depende do endpoint externo. A chave permanece igual mesmo se o exame for editado.

A rota retorna JSON com `message` no sucesso e `error` na falha. Falta de token
retorna 503; sessão inválida, 401; exame inexistente, excluído ou invisível por RLS,
404; dados recusados, 422. Há tratamento de conflito (409), limite (429), falha do
serviço (502) e timeout de 60 segundos (504). Não é salvo um histórico local de envios.

## Compatibilidade de renderização

A rota fica em `pages/api/exams/[id]/upload.ts` para usar o React 18 instalado
no projeto junto com `@react-pdf/renderer`. No Next.js 15, o App Router fornece
um runtime React de Server Components incompatível com esse renderizador.
Não mova essa rota para `app/api` sem validar a geração real de PDFs nesse runtime.
A autenticação por cookies usa `utils/supabase/api.ts`, incluindo renovação de sessão.
O serviço importa módulos Node (`node:fs/promises`), ficando restrito ao servidor;
o marcador de Server Components `server-only` não é usado em Pages API.

Erros inesperados são registrados no terminal com o prefixo `[exam-upload:etapa]`.
A resposta HTTP identifica a etapa em `code`, sem expor a stack ou a consulta ao usuário.
Quando a integração responde com erro, o terminal registra `[exam-upload:resposta_integracao]`
com o status HTTP externo, ID de rastreio (quando disponível) e até 4096 caracteres
da resposta, removendo o token usado na requisição. O JSON devolvido ao navegador
inclui `upstreamStatus` e `requestId`, sem o corpo da resposta externa.

## Tempos de envio

Cada tentativa registra `[exam-upload:tempos]` no terminal e retorna `timingsMs`
no JSON, tanto no sucesso quanto no erro. Todos os tempos estão em milissegundos:

- `autenticacao`: verificação da sessão Supabase.
- `consulta_exame`: busca do exame e suas relações.
- `geracao_pdf`: preparação dos dados, leitura das imagens, renderização e montagem do formulário.
- `integracao`: chamada HTTP, incluindo envio e espera pela resposta do serviço externo.
- `total`: duração da execução do handler.

Etapas não executadas ficam ausentes. O header `Server-Timing` também permite ver
esses tempos no DevTools, em Network → requisição de upload → Timing.
O tempo da integração não separa a transferência do processamento remoto; essa
separação exige instrumentação no backend externo. O total do handler não inclui
compilação em desenvolvimento, middleware ou inicialização anterior à sua execução.

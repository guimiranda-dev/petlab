# Importação de exames por imagem

Selecione tutor, pet e o tipo de exame. Abaixo de “Tipo do exame”, envie uma foto JPEG, PNG ou WebP de até 8 MB e clique em **Analisar imagem**. Escolha a coluna do animal e clique em **Importar** para preencher o formulário.

O servidor utiliza `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` de `.env.local`. Reinicie o Next.js após alterar essas variáveis. O modelo precisa aceitar imagens e respostas JSON estruturadas. A chave fica exclusivamente no servidor; a rota exige uma sessão Supabase autenticada. A imagem é enviada ao OpenRouter quando a análise é solicitada.

A extração segue o padrão do caderno: primeira linha com animal, segunda com tutor e uma coluna independente por exame. Para hemogramas, o servidor converte leucócitos e plaquetas de milhares para contagem absoluta. No diferencial, preserva o absoluto escrito e calcula quando apenas o percentual foi anotado. Ausências e valores ilegíveis não viram zero.

No hemograma, os resultados usam o de-para de abreviações do caderno. Para bioquímico, reticulócitos, coproparasitológico e urinálise, o servidor busca os campos de `exam_reference_values` do tipo selecionado e envia nomes, unidades e opções à IA. Os resultados são associados pelos IDs desses campos, incluindo valores numéricos, percentuais e textos. No coproparasitológico, resultados de seleção devem corresponder às opções cadastradas. Decimais são preenchidos com vírgula. As conversões específicas de hemograma não são aplicadas aos demais tipos. Valores extraídos substituem os campos correspondentes; campos ausentes na foto mantêm o preenchimento atual. Observações são acrescentadas ao formulário. A imagem e a transcrição original não são persistidas no banco por esta funcionalidade.

No teste da foto de exemplo, `openai/gpt-4o-mini` identificou as quatro colunas, mas apresentou divergências em números manuscritos.

O tipo selecionado precisa ter os campos correspondentes cadastrados no Supabase. Campos sem resultado na imagem mantêm o preenchimento atual. Resultados contendo somente percentual também são salvos.

Contrato multimodal e JSON estruturado: [documentação de imagens](https://openrouter.ai/docs/guides/overview/multimodal/image-understanding) e [JSON Schema](https://openrouter.ai/docs/guides/features/structured-outputs) do OpenRouter.

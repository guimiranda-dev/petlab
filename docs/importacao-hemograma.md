# Importação de hemograma por imagem

Selecione tutor, pet e o tipo **Hemograma**. Abaixo de “Tipo do exame”, envie uma foto JPEG, PNG ou WebP de até 8 MB e clique em **Analisar imagem**. Escolha a coluna do animal e clique em **Importar** para preencher o formulário.

O servidor utiliza `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` de `.env.local`. Reinicie o Next.js após alterar essas variáveis. O modelo precisa aceitar imagens e respostas JSON estruturadas. A chave fica exclusivamente no servidor; a rota exige uma sessão Supabase autenticada. A imagem é enviada ao OpenRouter quando a análise é solicitada.

A extração segue o padrão do caderno: primeira linha com animal, segunda com tutor e uma coluna independente por exame. O servidor converte leucócitos e plaquetas de milhares para contagem absoluta. No diferencial, preserva o absoluto escrito e calcula quando apenas o percentual foi anotado. Ausências e valores ilegíveis não viram zero.

Os resultados são associados pelos nomes dos itens cadastrados em `exam_reference_values`, sem IDs fixos. Valores extraídos substituem os campos correspondentes; campos ausentes na foto mantêm o preenchimento atual. Observações são acrescentadas ao formulário. A imagem e a transcrição original não são persistidas no banco por esta funcionalidade.

No teste da foto de exemplo, `openai/gpt-4o-mini` identificou as quatro colunas, mas apresentou divergências em números manuscritos.

Os demais tipos de exame continuam com preenchimento manual, pois este de-para é específico de hemograma.

Contrato multimodal e JSON estruturado: [documentação de imagens](https://openrouter.ai/docs/guides/overview/multimodal/image-understanding) e [JSON Schema](https://openrouter.ai/docs/guides/features/structured-outputs) do OpenRouter.

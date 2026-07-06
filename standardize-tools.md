# Plano de Padronização e Limpeza de Ferramentas

## Goal
Limpar e enriquecer as 202 novas ferramentas adicionadas ao `data/tools.json`, remover duplicatas mantendo os registros originais, traduzir e enquadrar pedagogicamente as descrições para o português, gerar dicas pedagógicas reais baseadas nas utilidades de cada ferramenta e alinhar o validador com a nomenclatura do frontend.

## Tasks
- [x] Task 1: Corrigir o script de validação `scripts/validate-tools.js` para aceitar `['Free', 'Freemium', 'Paid', 'Trial']` como `costType` de acordo com a tipagem do frontend.
  - Verify: Executar `npm run validate` e ver que não falha por causa da nomenclatura em inglês dos 20 itens originais.
- [x] Task 2: Gerar um banner genérico bonito `default.jpg` em `public/images/tools/` para servir de fallback de imagem para as ferramentas que não possuem screenshot dedicada.
  - Verify: Arquivo de imagem criado em `public/images/tools/default.jpg`.
- [x] Task 3: Escrever e executar um script de enriquecimento de dados (`scripts/enrich-tools.js`) que processe as 202 novas ferramentas da seguinte forma:
  - Eliminar duplicatas que já existem nos 20 registros originais (comparando por URL ou ID correspondente).
  - Usar inteligência contextual para gerar para cada ferramenta: `id` (kebab-case), `jobToBeDone` (resumo de até 12 palavras em português), `tip` (dica pedagógica real de até 20 palavras em português), `tags.lessonPhase` (etapas reais da aula) e `tags.outputFormat` (formatos de saída correspondentes).
  - Configurar fallback do `screenshotUrl` para `"/images/tools/default.jpg"`.
  - Verify: O arquivo `data/tools.json` conterá apenas um array de objetos JSON válidos e completos.
- [x] Task 4: Validar os dados gerados com o script oficial e rodar testes de integridade.
  - Verify: Executar `npm run validate` e `npm run test` com sucesso sem erros ou avisos críticos.

## Done When
- O arquivo `data/tools.json` conterá apenas um array JSON válido sem metadados brutos.
- Não haverá duplicados e todos os novos itens terão textos em português adequados às regras pedagógicas (limites de palavras).
- Os scripts `npm run validate` e `npm run test` rodam com sucesso.

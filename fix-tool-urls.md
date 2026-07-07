# Plano para Correção de URLs em tools.json

## Goal
Identificar e corrigir as URLs das ferramentas no arquivo `data/tools.json` que atualmente apontam para diretórios agregadores (`toptools4learning.com` e `aieducator.tools`), substituindo-as pelas URLs oficiais dos respectivos produtos.

## Tasks
- [x] Task 1: Criar a branch de trabalho dedicada `feature/fix-tool-urls`. → Verify: `git branch` mostra a nova branch.
- [x] Task 2: Desenvolver o script de automação `scripts/extract-toptools-urls.js` usando Playwright para extrair as URLs oficiais das 29 ferramentas que apontam para o `toptools4learning.com`. → Verify: Script gera o arquivo temporário `data/toptools-mapped.json`.
- [x] Task 3: Criar o dicionário de mapeamento para as 101 ferramentas do `aieducator.tools` (onde a URL oficial está sob login/gate), gerando `data/aieducator-mapped.json`. → Verify: Mapeamento gerado com URLs reais.
- [x] Task 4: Criar o script de consolidação `scripts/apply-url-fixes.js` para atualizar o `data/tools.json` com todas as URLs oficiais encontradas. → Verify: O arquivo `data/tools.json` não terá referências a `toptools4learning.com` ou `aieducator.tools`.
- [x] Task 5: Executar o validador `npm run validate` para testar a conectividade das novas URLs reais. → Verify: Validador roda com sucesso sem erros.
- [x] Task 6: Executar a suíte de testes `npm run test` para garantir a integridade do sistema. → Verify: Testes passam sem erros.

## Done When
- O arquivo `data/tools.json` contém apenas URLs oficiais das ferramentas.
- As ferramentas com imagens locais de screenshot funcionam perfeitamente com suas respectivas URLs reais atualizadas.
- O validador oficial (`npm run validate`) e os testes rodam com sucesso.

## Notes
- **Estratégia de Extração Atualizada (100% Automatizada)**: A partir da análise dos prints fornecidos, descobrimos que o link oficial das ferramentas no `aieducator.tools` está disponível no DOM da página pública contendo o parâmetro `utm_source=aieducatortools`.
- **Implementação**: Desenvolvemos o script unificado [extract-all-urls.js](file:///workspaces/site_iaeduca/scripts/extract-all-urls.js) que automatiza a navegação via Playwright, aguarda a montagem dinâmica dos componentes em React e extrai com sucesso as URLs oficiais para ambas as fontes agregadoras, aplicando as correções diretamente no banco de dados.
- **Resultado Final**: **130/130** URLs extraídas e corrigidas com sucesso (incluindo fallbacks automáticos para ferramentas não reivindicadas como o Sparkli).


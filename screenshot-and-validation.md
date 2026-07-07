# Configuração de Screenshots e Validação

## Goal
Ajustar o script de validação de ferramentas para verificar caminhos de imagens locais, e implementar a automação de captura e otimização de screenshots com Playwright para os primeiros 50 itens sem imagem.

## Tasks
- [x] Task 1: Instalar `playwright` e `sharp` (ou testar se instalam com sucesso; fallback para `jimp` se falhar). → Verify: `npm install` sem erros.
- [x] Task 2: Ajustar `scripts/validate-tools.js` para diferenciar caminhos de imagem locais (que começam com `/`) e verificar se o arquivo existe fisicamente em `public/`. → Verify: `npm run validate` não gera alertas falsos para imagens locais.
- [x] Task 3: Criar o script `scripts/capture-screenshots.js` usando Playwright (Chromium headless) e Sharp (ou Jimp) para capturar a screenshot da URL de cada ferramenta, redimensionar para 16:10, otimizar para WebP (<25KB) e salvar em `public/images/tools/`. → Verify: Script criado e executável.
- [x] Task 4: Configurar o script para processar incrementalmente apenas as ferramentas com imagem `default.jpg`, limitando a execução para as primeiras 50 ferramentas nesta primeira fase. → Verify: Código contém a limitação/filtro e limite de 50.
- [x] Task 5: Executar o script de captura para as primeiras 50 ferramentas e validar se as imagens foram salvas corretamente. → Verify: Imagens criadas em `public/images/tools/` menores que 25KB.
- [x] Task 6: Executar `npm run validate` para verificar se tudo está em conformidade. → Verify: Comando finalizado com sucesso.

## Done When
- O validador não acusa alerta de rede para caminhos de imagens locais válidos.
- Até 50 novas imagens de capturas em formato `.webp` são salvas no repositório com tamanho individual sob 25KB.
- Os scripts `npm run validate` e `npm run test` rodam com sucesso.

## Decisions
- **Execução Sequencial**: Capturas serão feitas de forma estritamente sequencial para preservar recursos do Codespace.
- **Falha de Carregamento**: Se um site falhar ao carregar/bloquear, registrar o erro, manter a ferramenta apontando para `default.jpg` e prosseguir para a próxima ferramenta.


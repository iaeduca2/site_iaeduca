---
type: memory
topic: Automação de Scraping e Capturas de Tela
created: 2026-07-06
updated: 2026-07-06
---

# Planejamento: Automação de Scraping e Capturas de Tela (Prints)

Este documento registra os caminhos de decisão e o planejamento discutidos para viabilizar a visita aos sites das ferramentas, coleta de metadados didáticos e geração de capturas de tela sem estourar limites de custo ou sobrecarregar o repositório.

---

## 1. Captura de Tela (Screenshots)

### Opção Recomendada: Automação Local com Playwright + Otimização WebP
* **O que é:** Um script executado localmente na máquina do desenvolvedor (ou ambiente de desenvolvimento) utilizando Playwright/Puppeteer.
* **Vantagens:**
  * **Custo Zero:** Roda usando recursos locais, sem cobranças de servidores de nuvem.
  * **Baixo Bloqueio:** IPs residenciais têm muito menos chance de serem barrados por CDNs (ex: Cloudflare) em comparação com IPs de nuvem.
  * **Otimização de Armazenamento:** O script redimensiona automaticamente a imagem para aspect ratio de 16:10 (ex: 640x400) e exporta em formato `.webp` com compressão controlada (mantendo o arquivo <25KB). Isso evita inchar o repositório Git.

---

## 2. Coleta e Enriquecimento Pedagógico

### Opção Recomendada: Fluxo Semi-Automático (Scraping + IA Local/Prompt)
* **O que é:** O scraper local extrai os metadados brutos em inglês (`og:description`, `title`, conteúdo principal). Em seguida, essas informações são submetidas a uma IA (via prompt mestre ou API Gemini/Claude com cache) para sugerir a tradução e os enquadramentos pedagógicos:
  * `jobToBeDone` (resumo em português, máx. 12 palavras).
  * `tip` (dica prática de uso pedagógico para educador SENAI, máx. 20 palavras).
  * `tags.lessonPhase` e `tags.outputFormat`.
* **Revisão Humana:** Os dados gerados são salvos em uma lista temporária ou revisados pelo curador antes de serem consolidados no arquivo definitivo `tools.json`.

---

## 3. Próximos Passos
1. Instalar `playwright` ou `puppeteer` como dependência de desenvolvimento.
2. Criar o script utilitário de automação em `scripts/capture-screenshots.js`.
3. Configurar a função de otimização de imagens usando bibliotecas de compressão (ex: `sharp`).
4. Desenvolver o prompt mestre para o assistente de IA realizar as sugestões estruturadas dos campos pedagógicos em português.

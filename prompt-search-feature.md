# Plano Detalhado de Implementação: Busca Inteligente por Prompt (Estilo Chat)

> **Projeto:** Hub IA Educa (Astro + React + TailwindCSS v4)  
> **Objetivo:** Substituir a barra de busca e os select-boxes estáticos tradicionais por um componente conversacional estilo Prompt Box de IA com busca garantida (zero resultados zerados).  
> **Status:** 🎉 CONCLUÍDO COM SUCESSO  

---

## 🏗️ Arquitetura & Fluxo de Dados

```
[ Top Bar: Titulo + Botão 🎛️ Filtros ]
                  │
                  ▼
[ Campo de Textarea + Botão ✨ Enviar ]
                  │
                  ▼
[ 🎯 Filtros Reconhecidos no Prompt / Badges ]
                  │
                  ▼
[ 🎛️ Accordion de Filtros Manuais (quando ativo) ]
                  │
                  ▼
[ 💡 Frases de Sugestão de Professores (Exemplos Rápidos) ]
```

---

## 📋 Detalhamento das Tarefas & Estimativas de Tempo

### 🔹 Fase 1: Motor de Análise Semântica (Parser NLP Client-Side)
**Status:** ✅ CONCLUÍDA  

- [x] **Task 1.1: Estrutura de Tipos e Dicionário de Sinônimos (`src/lib/prompt-parser.ts`)**
- [x] **Task 1.2: Algoritmo de Extração e Limpeza Residual (`src/lib/prompt-parser.ts`)**
- [x] **Task 1.3: Suíte de Testes Unitários de Cobertura (`src/lib/prompt-parser.test.ts`)**

---

### 🔹 Fase 2: Componente UI Conversacional (`src/components/ToolGallery.tsx`)
**Status:** ✅ CONCLUÍDA  

- [x] **Task 2.1: Reestruturação do Layout da Caixa de Busca**
- [x] **Task 2.2: Integração de Chips de Exemplo Rápido (Prompt Presets)**
- [x] **Task 2.3: Renderização do Painel de Filtros Reconhecidos (Badges)**
- [x] **Task 2.4: Accordion de Filtros Manuais (Selects Retráteis)**
- [x] **Task 2.5: Botão Globais de Limpeza e Contador de Resultados**

---

### 🔹 Fase 3: Validação de Qualidade & Build Estático
**Status:** ✅ CONCLUÍDA  

- [x] **Task 3.1: Execução dos Testes Automatizados** (`8/8 testes aprovados`)
- [x] **Task 3.2: Compilação de Produção Astro** (`1/1 páginas estáticas geradas`)

---

### 🔹 Fase 4: Ajustes de UX & Submissão Sob Demanda
**Status:** ✅ CONCLUÍDA  

- [x] **Task 4.1: Submissão sob Demanda (Botão ✨ Enviar ou tecla Enter)**
- [x] **Task 4.2: Animação Visual "Processando intenção... ✨" (550ms)**
- [x] **Task 4.3: Curadoria de Presets de Exemplo (100% de Resultados Válidos)**
- [x] **Task 4.4: Refinamento de Stopwords no Parser (`src/lib/prompt-parser.ts`)**
- [x] **Task 4.5: Validação Integrada e Evidência de Conclusão (Playwright)**

---

### 🔹 Fase 5: Destaque de Filtros Manuais & Busca Tolerante a Falhas
**Status:** ✅ CONCLUÍDA  

- [x] **Task 5.1: Botão de Filtros Manuais Proeminente**
- [x] **Task 5.2: Algoritmo de Soft Matching e Fallback de Busca (`src/lib/tool-filters.ts`)**
- [x] **Task 5.3: Interface de Feedback de Fallback com Mensagem Amigável**
- [x] **Task 5.4: Testes Automatizados de Soft Matching (`src/lib/tool-filters.test.ts`)**
- [x] **Task 5.5: Validação e Build Final (100% Passando)**

---

### 🔹 Fase 6: Rótulo "Filtros" & 8 Presets Pedagógicos Reais
**Status:** ✅ CONCLUÍDA  

- [x] **Task 6.1: Renomear o Botão de Filtros Manuais para `🎛️ Filtros`**
- [x] **Task 6.2: Expandir o dicionário NLP para termos pedagógicos**
- [x] **Task 6.3: Criar 8 Presets em Linguagem Natural Autêntica de Professores**
- [x] **Task 6.4: Testes de Integração dos 8 Presets com Playwright**
- [x] **Task 6.5: Validação e Build Final**

---

### 🔹 Fase 7: Reordenação de Layout — Filtros antes das Sugestões
**Status:** ✅ CONCLUÍDA  

- [x] **Task 7.1: Reordenar o JSX em `src/components/ToolGallery.tsx`** (Badges e Accordion de Filtros colocados diretamente abaixo da caixa de texto)
- [x] **Task 7.2: Validação E2E com Playwright**
- [x] **Task 7.3: Build Estático Astro (`npm run build`) e Testes Unitários (`npm run test`)**

---

## 🎯 Critérios de Aceite (Done When)

1. [x] Motor de parsing NLP client-side funcionando.
2. [x] A busca é acionada após confirmação do usuário com animação de processamento.
3. [x] O botão de filtros manuais é simples e proeminente, rotulado como `🎛️ Filtros`.
4. [x] Existem exatamente 8 chips de sugestão rápida escritos em linguagem natural pedagógica realista.
5. [x] **Os Filtros reconhecidos (`🎯 Filtros reconhecidos no seu prompt`) e os Filtros manuais aparecem ANTES dos exemplos de professores.**
6. [x] Todos os testes unitários e o build do Astro passam limpos.

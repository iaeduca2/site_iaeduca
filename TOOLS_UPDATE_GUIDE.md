# 📋 Como Atualizar a Lista de Ferramentas

Este guia explica como adicionar e validar novas ferramentas de IA na lista.

---

## 🚀 Workflow de Atualização

```
1. Use o Prompt com IA de Pesquisa
   ↓
2. Copie o JSON retornado
   ↓
3. Adicione ou edite em data/tools.json
   ↓
4. Valide com npm run validate
   ↓
5. Faça commit e deploy
```

---

## 📝 Step 1: Use o Prompt para Pesquisar

### Prompt Template

Copie e execute com **ChatGPT, Claude, ou Perplexity**:

```markdown
# Prompt: Buscar Ferramenta de IA Educacional

Pesquise sobre a ferramenta de IA: [NOME DA FERRAMENTA]

Retorne EXATAMENTE neste formato JSON (sem markdown, sem explicações):

{
  "id": "ferramenta-id-em-kebab-case",
  "name": "Nome Exato da Ferramenta",
  "jobToBeDone": "Descrição breve (max 12 palavras) do que ela faz",
  "screenshotUrl": "URL direta de imagem 16:10 (preferir logo ou interface)",
  "url": "URL oficial do site",
  "tags": {
    "lessonPhase": ["ideação", "produção", "avaliação"],
    "outputFormat": ["texto", "imagem", "vídeo", "áudio"],
    "costType": "Freemium"
  },
  "tip": "Dica pedagógica breve para educador SENAI usar (max 20 palavras)"
}

## Guia de Campos

### id
- kebab-case, único, sem caracteres especiais
- Exemplo: "chatgpt", "dall-e-3", "perplexity-ai"

### jobToBeDone
- **Máximo 12 palavras** (crítico!)
- Foco no VALOR, não na feature
- ✅ Bom: "Gerar imagens realistas a partir de descrições"
- ❌ Ruim: "Ferramenta de IA generativa com capacidades avançadas"

### screenshotUrl
- URL pública acessível
- Preferir: logo da ferramenta OU screenshot da interface
- Requisitos: 16:10 aspect ratio, >300px largura
- Procurar em: site oficial, GitHub, Product Hunt

### tags.lessonPhase
- Escolha **1-3** de:
  - `ideação` — início da aula, brainstorm
  - `produção` — criação de conteúdo
  - `avaliação` — testes, feedback
  - `planejamento` — preparação de aula

### tags.outputFormat
- Escolha **1-3** de:
  - `texto` — documentos, resumos
  - `imagem` — designs, ilustrações
  - `vídeo` — edição, roteiros
  - `áudio` — podcasts, legendas
  - `código` — scripts, programação
  - `dados` — planilhas, análises

### tags.costType
- **Exatamente uma** de:
  - `Gratuita` — sem custos
  - `Freemium` — uso grátis com limite, pago unlimited
  - `Paga` — subscription obrigatória
  - `Código Aberto` — open source

### tip
- Situação pedagógica específica para educador SENAI
- **Máximo 20 palavras**
- Exemplo: "Ideal para criar roteiros de vídeo antes de produção profissional"

## ⚠️ Validação

Antes de copiar o JSON, confirme:
- [ ] URL respondendo (testei em navegador)
- [ ] screenshotUrl acessível (16:10 ratio)
- [ ] jobToBeDone ≤ 12 palavras
- [ ] tip ≤ 20 palavras
- [ ] tags têm 1-3 items cada
- [ ] JSON válido (sem erros de sintaxe)

Se algo faltar, marque com [FALTA: descrição] no campo.
```

---

## 📄 Step 2: Editar `data/tools.json`

### Adicionar Nova Ferramenta

1. Abra `data/tools.json`
2. Cole o JSON no final do array:

```json
[
  // ... ferramentas existentes ...
  
  {
    "id": "nova-ferramenta",
    "name": "Nova Ferramenta",
    "jobToBeDone": "Descrição em até 12 palavras",
    "screenshotUrl": "https://example.com/screenshot.jpg",
    "url": "https://novaferramenta.com",
    "tags": {
      "lessonPhase": ["ideação", "produção"],
      "outputFormat": ["texto", "imagem"],
      "costType": "Freemium"
    },
    "tip": "Como usar em aula (máx 20 palavras)"
  }
]
```

3. Verifique que o JSON é válido (sem erros de sintaxe)

---

## ✅ Step 3: Validar com `npm run validate`

```bash
npm run validate
```

### Saída Esperada

```
📋 Validating 20 tools...

✅ All validations passed!
```

### Possíveis Erros

| Erro | Solução |
|------|---------|
| `Missing required field: X` | Adicione o campo faltando |
| `jobToBeDone has 35 words` | Reduza para ≤12 palavras |
| `tip has 25 words` | Reduza para ≤20 palavras |
| `Invalid URL format: X` | Verifique URL (http/https completo) |
| `tags.costType must be one of` | Use um dos 4 tipos exatos |

---

## 🔄 Step 4: Validação Automática (GitHub)

Quando você faz commit e push:

```bash
git add data/tools.json
git commit -m "docs: add [ferramenta]"
git push origin main
```

✅ **GitHub Actions** roda validação automaticamente:
- Se passar: ✅ Deploy acontece
- Se falhar: ❌ Feedback no PR com erros

---

## 📚 Exemplo Completo

### Entrada (IA de Pesquisa)

```markdown
Pesquise sobre ChatGPT...
```

### Saída (JSON)

```json
{
  "id": "chatgpt",
  "name": "ChatGPT",
  "jobToBeDone": "Assistente IA conversacional para ideação e pesquisa",
  "screenshotUrl": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  "url": "https://chat.openai.com",
  "tags": {
    "lessonPhase": ["ideação", "produção"],
    "outputFormat": ["texto"],
    "costType": "Freemium"
  },
  "tip": "Use para brainstorm de projetos e feedback em roteiros educacionais"
}
```

### Validação

```bash
npm run validate
# ✅ All validations passed!
```

---

## 🛠️ Desenvolvimento Local

### Testar Validação

```bash
# Validar dados
npm run validate

# Build do site
npm run build

# Rodar site localmente
npm run preview
```

### Estrutura

```
site_iaeduca/
├── data/
│   └── tools.json              ← Sua fonte de dados
├── scripts/
│   └── validate-tools.js       ← Script de validação
├── .github/workflows/
│   └── validate-tools.yml      ← GitHub Actions (automático)
└── src/
    └── components/
        └── ToolGallery.tsx     ← Componente que exibe as ferramentas
```

---

## 📞 Dúvidas?

- **Erro na validação?** Leia o erro e compare com a tabela acima
- **JSON inválido?** Use https://jsonlint.com/ para verificar
- **URL não responde?** Verifique em seu navegador primeiro

---

## ✨ Próximas Melhorias

- [ ] Automação de atualização de screenshots
- [ ] Integração com Product Hunt API para novas descobertas
- [ ] Sistema de votação da comunidade
- [ ] Histórico de preços/atualizações

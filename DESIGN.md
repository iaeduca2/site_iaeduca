---
version: alpha
name: Hub IA Educa
description: Hub curado de ferramentas de Inteligência Artificial para apoiar educadores e alunos SENAI em suas rotinas pedagógicas. Linguagem visual institucional, confiável e mobile-first, alinhada ao manual de marca SENAI.
colors:
  primary: "#164194"
  primary-hover: "#102F6E"
  primary-tint: "#E8EDF7"
  accent: "#E84910"
  accent-hover: "#C93D0D"
  accent-tint: "#FDEAE2"
  neutral-bg: "#F4F5F7"
  surface: "#FFFFFF"
  ink: "#1B1F27"
  ink-muted: "#5B6472"
  border: "#E2E5EA"
  on-primary: "#FFFFFF"
  on-accent: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.02em
rounded:
  sm: 6px
  md: 12px
  lg: 20px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
components:
  header:
    backgroundColor: "{colors.surface}"
    padding: "{spacing.md}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    padding: "{spacing.xl}"
  card-tool:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 20px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
    typography: "{typography.label-md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label-md}"
  chip-filter:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: 8px
    typography: "{typography.label-sm}"
  chip-filter-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  badge-free:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.full}"
    typography: "{typography.label-sm}"
  badge-freemium:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-sm}"
  badge-trial:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-hover}"
    rounded: "{rounded.full}"
    typography: "{typography.label-sm}"
  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

# Hub IA Educa

## Overview

**Leitura de design:** diretório curado de ferramentas de IA para uma instituição pública de ensino profissional (SENAI), com linguagem *trust-first*, institucional e de marca forte — não uma landing page de marketing. Público-alvo: educadores e alunos SENAI, em qualquer nível de familiaridade digital. Confiança, clareza e leitura rápida importam mais que espetáculo visual.

Dials de referência (não fazem parte do schema, orientam decisões de layout/motion): `DESIGN_VARIANCE: 4` · `MOTION_INTENSITY: 3` · `VISUAL_DENSITY: 4`. Ou seja: grade organizada e previsível, transições curtas e funcionais (sem animações decorativas em loop), densidade média (cards com respiro, mas sem exagero de whitespace editorial).

O azul institucional carrega autoridade e confiança; o laranja é usado com moderação, só para destaque e interação (hover, badges de atenção, foco). Nunca usar roxo, gradientes genéricos de IA, ou glassmorphism — não fazem parte da identidade SENAI.

## Colors

- `primary` (#164194) — Azul Principal. Headers, botões primários, links, footer institucional.
- `accent` (#E84910) — Laranja SENAI. Usado com moderação: hover, badges de destaque/trial, foco de teclado.
- `neutral-bg` (#F4F5F7) — Fundo padrão das páginas.
- `surface` (#FFFFFF) — Fundo de cards e modais.
- `ink` / `ink-muted` — Texto principal e secundário (evitar preto puro, mais suave para leitura prolongada).
- `border` — Bordas sutis entre `surface` e `neutral-bg`.
- Tons de badge (`primary-tint`, `accent-tint`) são derivados do próprio azul/laranja da marca, nunca cores externas (nada de verde/vermelho semáforo) — mantém tudo dentro da paleta oficial.

## Typography

Fonte: **Inter** (conforme diretrizes-design.md — alternativa aceita: Roboto). Pesos bold/semi-bold para títulos, regular para corpo de texto. Escala enxuta (8 níveis) o suficiente para hierarquia clara sem excesso de variações.

## Layout

- Mobile-first: 1 coluna de cards em telas pequenas, 2 em tablet (`md:`), 3–4 em desktop (`lg:`/`xl:`).
- Container com largura máxima confortável para leitura (~1200px), padding lateral `{spacing.md}` no mobile, `{spacing.lg}` no desktop.
- Escala de espaçamento consistente (`xs` a `2xl`) para todo o ritmo vertical da página.

## Elevation & Depth

Design tonal e plano — sem sombras pesadas ou glassmorphism. Cards usam `border` sutil em repouso; no hover/focus, uma sombra leve de um único nível (`0 4px 12px rgba(22,65,148,0.08)`) sinaliza interatividade sem parecer "flutuante" demais.

## Shapes

- `rounded.lg` (20px) em cards de ferramenta e modais — transmite acessibilidade/acolhimento.
- `rounded.md` (12px) em botões e inputs.
- `rounded.full` em badges e chips de filtro (formato pílula).

## Components

- **Header**: fundo branco, logo "Projeto IA Educa" (`logo-ia-educa.png`) à esquerda com proteção mínima de 24px, navegação simples.
- **Footer**: fundo azul (`{colors.primary}`), usa as versões **negativas** dos logos (`logo-ia-educa-negativo.png`, `logo-centro-inovacao-negativo.png`) — nunca a versão colorida sobre fundo escuro.
- **Tool Card**: screenshot no topo (`screenshotUrl`), nome, `jobToBeDone` truncado, badges de `outputFormat`/`lessonPhase`, badge de custo (`badge-free`/`badge-freemium`/`badge-trial` conforme `costType`).
- **Filtros**: chips (`chip-filter`/`chip-filter-active`) para `lessonPhase` e `outputFormat`; busca por texto no nome/descrição.
- **Modal de detalhe**: abre com foco preso (focus trap), fecha com `Esc` ou clique fora, mostra `tip` (Dica SENAI) e link externo para a ferramenta.
- **Botões**: `button-primary` (ação principal, ex: "Acessar ferramenta") e `button-ghost` (ações secundárias, ex: "Fechar").

## Do's and Don'ts

**Do's**
- Usar o laranja com moderação — destaque, não decoração.
- Manter contraste AA em todo texto sobre `primary` e `neutral-bg`.
- Respeitar a margem de proteção do logo (mínimo 24px).
- Usar a versão negativa do logo em qualquer fundo escuro/azul.

**Don'ts**
- Não introduzir cores fora da paleta definida (nada de roxo, nada de verde/vermelho semáforo para status).
- Não usar a versão colorida do logo sobre fundo escuro.
- Não usar glassmorphism, gradientes decorativos ou animações em loop infinito.
- Não criar um hero de marketing genérico — este é um diretório de ferramentas, a prioridade é encontrar e comparar rapidamente.

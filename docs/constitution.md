<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Reorganização: constitution.md e diretrizes-design.md movidos para docs/
- Removidas referências ao fluxo speckit (/speckit.implement, tasks.md); este projeto não adota esse padrão
- Corrigido link quebrado para docs/diretrizes-design.md
- Follow-up TODOs: none
-->

# Hub IA Educa Constitution

## Core Principles

### I. Arquitetura Base Astro + React
Every new experience MUST be implemented on top of Astro as the default runtime foundation, with content-oriented pages and layouts organized in the native structure under src/pages and src/layouts. React MUST be used only for interactive islands and client-side state, and the curated tools gallery and its filters MUST be implemented as a React-encapsulated component loaded with client:load so global filter state remains isolated and maintainable. This preserves performance and keeps the architecture ready for future content expansion.

### II. Identidade Visual e Design System
The product MUST follow a mobile-first, modern visual language aligned with the SENAI brand manual. Tailwind CSS MUST be used for styling, and the primary brand colors MUST be configured in tailwind.config.mjs as Azul Principal (#164194) and Laranja SENAI (#E84910). shadcn/ui MAY be adopted when it fits the Astro and React environment without introducing unnecessary complexity. This ensures consistency across the interface and future pages.

### III. Camada de Dados e Extensibilidade
The MVP (Minimum Viable Product) MUST read curated educational tool data from a dedicated data/tools.json file through asynchronous loading, and any search or filtering logic MUST be abstracted behind a reusable data-access layer so it can later be replaced by a relational database or BaaS service such as Supabase without rewriting the whole experience. This keeps the initial product simple while preserving a scalable data strategy.

### IV. Acessibilidade e Governança de Conteúdo
All interfaces MUST use semantic HTML in Astro and provide keyboard-accessible navigation for React-based modals and interactive surfaces. The MVP MUST remain read-only, with no user data collection, authentication, or account creation. Content and interactions MUST be understandable, inclusive, and consistent with the repository guidance and brand standards. This protects trust and keeps the product aligned with the educational mission.

### V. Testes e Evolução Segura
A lean test suite MUST be maintained with Vitest and React Testing Library for critical business and logic components, especially the filtering engine for the curated tools experience. Tests MUST focus on high-value behavior and be added when a change affects core user flows or reusable logic. This supports safe evolution without turning the project into a heavy testing burden.

## Arquitetura e Escalabilidade
New pages and sections MUST be designed as modular additions that can grow from the current MVP (Minimum Viable Product) without breaking the existing architecture. Future content areas such as Blog, Tutoriais, and Diretrizes Pedagógicas MUST be structured so they can be added incrementally through content collections, page templates, or reusable components. The architecture MUST remain prepared for future expansion rather than locking the project into a single-page implementation.

## Processo de Desenvolvimento e Qualidade
All implementation work MUST be documented, reviewed, and verified before being considered complete. Changes that affect user-facing behavior, content structure, or visual design MUST be checked against this constitution and the repository guidance in [diretrizes-design.md](./diretrizes-design.md). Pull requests MUST describe the intent, impacted scope, and evidence of validation. When a change cannot fully satisfy a principle, the exception MUST be explicitly documented and justified.

## Governança de Código e Versionamento (Git)
Development MUST remain strictly atomic: each implemented task or logical unit of work MUST correspond to a single commit. After completing a task, the agent MUST stop and explicitly suggest the corresponding commit message before advancing to the next task. Suggested commit messages MUST follow the Conventional Commits format (for example: feat: ..., fix: ..., test: ...), written in imperative mood and in English.

## Governance
This constitution supersedes informal practices for architecture, content, and interface decisions in this repository. Any amendment MUST update this document with a version bump, a clear rationale, and a summary of the affected guidance. Material changes to the principles or review requirements MUST be approved by maintainers before adoption.

All repository changes MUST be evaluated against these principles. If a conflict is unavoidable, the exception MUST be temporary, documented, and reviewed by the maintainers.

**Version**: 1.1.0 | **Ratified**: 2026-06-30 | **Last Amended**: 2026-07-01

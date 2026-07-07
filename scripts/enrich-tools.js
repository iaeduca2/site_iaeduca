import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_PATH = path.join(__dirname, '../data/tools.json');

// Curated dictionary for high-quality, real translations and data for the unique tools.
// Each tool is mapped by a normalized key.
const toolDictionary = {
  "gemini": {
    name: "Gemini",
    jobToBeDone: "Assistente de IA do Google para criação de conteúdos e pesquisa rápida.",
    tip: "Use para brainstorm de planos de aula e elaboração de exercícios práticos.",
    tags: {
      lessonPhase: ["Planejamento", "Pesquisa", "Execução"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "articulate": {
    name: "Articulate",
    jobToBeDone: "Criação de cursos online interativos e materiais de e-learning profissionais.",
    tip: "Use para criar trilhas de aprendizagem ramificadas com feedbacks interativos para os alunos.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Slides", "Vídeo"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "grammarly": {
    name: "Grammarly",
    jobToBeDone: "Corretor gramatical e assistente de escrita baseado em inteligência artificial.",
    tip: "Ótimo para ajudar alunos na revisão de relatórios técnicos e TCCs.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "notebooklm": {
    name: "NotebookLM",
    jobToBeDone: "Assistente de pesquisa da Google que analisa documentos e gera resumos.",
    tip: "Suba seus planos de aula e apostilas para interagir com seus materiais.",
    tags: {
      lessonPhase: ["Pesquisa", "Planejamento"],
      outputFormat: ["Texto"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "duolingo": {
    name: "Duolingo",
    jobToBeDone: "Aplicativo gamificado para aprendizagem de idiomas de forma interativa.",
    tip: "Ideal para indicar como atividade complementar no ensino de inglês técnico.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Texto", "Áudio"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "moodle": {
    name: "Moodle",
    jobToBeDone: "Ambiente virtual de aprendizagem de código aberto para gestão de cursos.",
    tip: "Organize suas salas de aula virtuais, fóruns de discussão e envie notas.",
    tags: {
      lessonPhase: ["Planejamento", "Execução", "Avaliação"],
      outputFormat: ["Texto", "Links"],
      costType: "Free",
      costDetail: "Gratuito e de código aberto"
    }
  },
  "hihaho": {
    name: "hihaho",
    jobToBeDone: "Criação de vídeos interativos com perguntas e destaques na tela.",
    tip: "Transforme vídeos expositivos em questionários em tempo real para reter a atenção.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Vídeo", "Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "google-forms": {
    name: "Google Forms",
    jobToBeDone: "Criação de formulários, testes online e pesquisas com tabulação imediata.",
    tip: "Aplique questionários rápidos ao final das aulas para medir a compreensão.",
    tags: {
      lessonPhase: ["Avaliação", "Planejamento"],
      outputFormat: ["Texto", "Quizzes"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "claude": {
    name: "Claude",
    jobToBeDone: "Assistente de IA avançado para escrita criativa, análise e programação.",
    tip: "Use para criar roteiros de aulas práticas ou analisar códigos de alunos.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto", "Código"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "deepl": {
    name: "DeepL",
    jobToBeDone: "Tradutor online de alta precisão para diversos idiomas em segundos.",
    tip: "Traduza artigos acadêmicos ou manuais mantendo a precisão terminológica técnica.",
    tags: {
      lessonPhase: ["Pesquisa", "Planejamento"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "camtasia": {
    name: "Camtasia",
    jobToBeDone: "Gravador de tela e editor de vídeo profissional focado em tutoriais.",
    tip: "Grave videoaulas demonstrando softwares técnicos com anotações e setas na tela.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Vídeo"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "quizlet": {
    name: "Quizlet",
    jobToBeDone: "Criação de flashcards e jogos educativos para memorização de termos.",
    tip: "Ideal para fixar siglas de normas técnicas ou componentes mecânicos.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Quizzes", "Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "genially": {
    name: "Genially",
    jobToBeDone: "Plataforma para apresentações interativas, infográficos e jogos didáticos.",
    tip: "Crie infográficos que revelam informações adicionais ao clique do aluno.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Slides", "Imagem"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "elevenlabs": {
    name: "ElevenLabs",
    jobToBeDone: "Gerador de vozes ultra-realistas a partir de textos em múltiplos idiomas.",
    tip: "Gere narrações de áudio acessíveis para suas apresentações de slides.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Áudio"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "capcut": {
    name: "CapCut",
    jobToBeDone: "Editor de vídeo fácil de usar com legendagem automática por IA.",
    tip: "Use a legenda automática para tornar suas videoaulas acessíveis para alunos surdos.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "clipchamp": {
    name: "ClipChamp",
    jobToBeDone: "Editor de vídeo online integrado nativamente ao ecossistema Windows.",
    tip: "Edite e exporte gravações de aulas rápidas sem precisar instalar programas pesados.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "quizizz": {
    name: "Quizizz",
    jobToBeDone: "Avaliação formativa dinâmica com questionários interativos e jogos de perguntas.",
    tip: "Aplique testes interativos divertidos com pontuação em tempo real em sala.",
    tags: {
      lessonPhase: ["Avaliação", "Execução"],
      outputFormat: ["Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "synthesia": {
    name: "Synthesia",
    jobToBeDone: "Criação de vídeos corporativos com avatares de inteligência artificial ultra-realistas.",
    tip: "Crie tutoriais de vídeo profissionais a partir de roteiros escritos rapidamente.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "mindsmith": {
    name: "Mindsmith",
    jobToBeDone: "Assistente de IA para a autoria de lições e e-learning rápidos.",
    tip: "Gere uma lição interativa sobre conceitos técnicos em minutos para reforço.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto", "Slides"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "khan-academy": {
    name: "Khan Academy",
    jobToBeDone: "Aulas e exercícios de matemática, ciências e computação totalmente gratuitos.",
    tip: "Excelente para sugerir nivelamento de matemática básica antes das aulas técnicas.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Vídeo", "Quizzes"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "grok": {
    name: "Grok",
    jobToBeDone: "Assistente de inteligência artificial com respostas baseadas em dados em tempo real.",
    tip: "Use para trazer dados recentes e debater tópicos contemporâneos nas aulas.",
    tags: {
      lessonPhase: ["Pesquisa", "Execução"],
      outputFormat: ["Texto"],
      costType: "Paid",
      costDetail: "Disponível em planos pagos"
    }
  },
  "vyond": {
    name: "Vyond",
    jobToBeDone: "Criação de animações e simulações profissionais para treinamento corporativo.",
    tip: "Ilustre cenários de riscos e segurança do trabalho com personagens animados.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "coursera": {
    name: "Coursera",
    jobToBeDone: "Cursos online e certificações de grandes universidades globais renomadas.",
    tip: "Recomende especializações extracurriculares de ponta para enriquecer o portfólio dos alunos.",
    tags: {
      lessonPhase: ["Execução", "Pesquisa"],
      outputFormat: ["Vídeo", "Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "heygen": {
    name: "HeyGen",
    jobToBeDone: "Geração de vídeos realistas e dublagem por avatares de IA.",
    tip: "Dubles videoaulas para outros idiomas mantendo a sincronização labial perfeita.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "screenpal": {
    name: "ScreenPal",
    jobToBeDone: "Gravação de tela e câmera para feedbacks e videoaulas rápidas.",
    tip: "Grave a correção dos projetos dos alunos fornecendo feedback em áudio.",
    tags: {
      lessonPhase: ["Avaliação", "Execução"],
      outputFormat: ["Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "lessonup": {
    name: "LessonUp",
    jobToBeDone: "Plataforma de criação de aulas interativas com vídeos e quiz.",
    tip: "Crie slides interativos e colete respostas instantâneas dos celulares dos alunos.",
    tags: {
      lessonPhase: ["Planejamento", "Execução", "Avaliação"],
      outputFormat: ["Slides", "Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "anewspring": {
    name: "aNewSpring",
    jobToBeDone: "Ambiente adaptativo de e-learning focado em trilhas personalizadas profissionais.",
    tip: "Desenvolva jornadas de treinamento baseadas no desempenho individual do aluno.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto", "Quizzes"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "clickup": {
    name: "ClickUp",
    jobToBeDone: "Gestão centralizada de projetos, tarefas de equipe e documentação interna.",
    tip: "Monitore as entregas dos alunos em projetos interdisciplinares de forma visual.",
    tags: {
      lessonPhase: ["Planejamento", "Rotinas Administrativas"],
      outputFormat: ["Texto", "Links"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "affinity-designer": {
    name: "Affinity Designer",
    jobToBeDone: "Editor de gráficos vetoriais de alta performance para designers profissionais.",
    tip: "Excelente alternativa leve ao Illustrator para aulas de design gráfico.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Imagem"],
      costType: "Paid",
      costDetail: "Compra única paga"
    }
  },
  "adobe-express": {
    name: "Adobe Express",
    jobToBeDone: "Criação rápida de posts, vídeos e designs de marketing visual.",
    tip: "Ensine alunos a criarem banners e relatórios com layouts profissionais.",
    tags: {
      lessonPhase: ["Execução"],
      outputFormat: ["Imagem", "Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "algor-education": {
    name: "Algor Education",
    jobToBeDone: "Criação de mapas conceituais e resumos automáticos a partir de textos.",
    tip: "Ideal para alunos sintetizarem capítulos de livros em mapas mentais interativos.",
    tags: {
      lessonPhase: ["Pesquisa", "Planejamento"],
      outputFormat: ["Imagem", "Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "amira-learning": {
    name: "Amira Learning",
    jobToBeDone: "Assistente de leitura inteligente com feedback de fala em tempo real.",
    tip: "Use para apoiar alunos em fase de alfabetização ou aprendizado de pronúncia.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Áudio"],
      costType: "Paid",
      costDetail: "Planos escolares pagos"
    }
  },
  "beautiful-ai": {
    name: "Beautiful.ai",
    jobToBeDone: "Criação de apresentações com slides auto-ajustáveis baseados em design inteligente.",
    tip: "Foque no conteúdo enquanto a ferramenta ajusta o layout das informações.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Slides"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "bookcreator": {
    name: "BookCreator",
    jobToBeDone: "Criação de livros digitais interativos integrando áudio, vídeo e texto.",
    tip: "Proponha a criação de portfólios ou relatórios em formato de livro digital.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Texto", "Imagem", "Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "brisk-teaching": {
    name: "Brisk Teaching",
    jobToBeDone: "Extensão de IA que ajuda professores a criarem materiais educacionais rápidos.",
    tip: "Gere feedbacks de redação e planos de aula diretamente do Google Docs.",
    tags: {
      lessonPhase: ["Planejamento", "Avaliação", "Rotinas Administrativas"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "canva": {
    name: "Canva",
    jobToBeDone: "Plataforma de design gráfico com recursos de IA para layouts rápidos.",
    tip: "Crie apresentações, infográficos e cartazes com recursos visuais ricos e modernos.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Imagem", "Slides", "Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito para professores"
    }
  },
  "classpoint": {
    name: "ClassPoint",
    jobToBeDone: "Ferramenta de gamificação e questionários interativos integrada no PowerPoint.",
    tip: "Transforme suas apresentações clássicas em jogos de perguntas interativos e dinâmicos.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Quizzes", "Slides"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "classcraft": {
    name: "Classcraft",
    jobToBeDone: "Gamificação de sala de aula transformando o comportamento em jogo.",
    tip: "Use para aumentar o engajamento através de missões e pontuações comportamentais.",
    tags: {
      lessonPhase: ["Execução", "Rotinas Administrativas"],
      outputFormat: ["Texto", "Links"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "codecademy": {
    name: "Codecademy",
    jobToBeDone: "Plataforma interativa com cursos práticos de programação e TI.",
    tip: "Ideal para indicar exercícios de código práticos aos alunos de desenvolvimento.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Código"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "conker": {
    name: "Conker",
    jobToBeDone: "Criação de questionários e testes de múltipla escolha com IA.",
    tip: "Gere avaliações formativas alinhadas a temas específicos em segundos.",
    tags: {
      lessonPhase: ["Planejamento", "Avaliação"],
      outputFormat: ["Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "copilot": {
    name: "Copilot",
    jobToBeDone: "Assistente de IA da Microsoft integrado ao Bing e pacote Office.",
    tip: "Use para pesquisar artigos acadêmicos com referências reais diretamente na web.",
    tags: {
      lessonPhase: ["Planejamento", "Pesquisa", "Execução"],
      outputFormat: ["Texto"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "consensus": {
    name: "Consensus",
    jobToBeDone: "Mecanismo de busca acadêmica que sintetiza respostas com artigos científicos.",
    tip: "Excelente para validar hipóteses em projetos de pesquisa com literatura científica.",
    tags: {
      lessonPhase: ["Pesquisa", "Planejamento"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "curipod": {
    name: "Curipod",
    jobToBeDone: "Criação de lições interativas com enquetes, desenhos e quiz.",
    tip: "Crie apresentações que exigem a participação ativa do aluno em tempo real.",
    tags: {
      lessonPhase: ["Planejamento", "Execução", "Avaliação"],
      outputFormat: ["Slides", "Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "d-id": {
    name: "D-ID",
    jobToBeDone: "Criação de vídeos de apresentadores falantes a partir de fotos.",
    tip: "Crie avatares falantes narrando instruções de laboratório ou introdução das aulas.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "decktopus": {
    name: "Decktopus",
    jobToBeDone: "Gerador automático de apresentações e slides baseados em tópicos simples.",
    tip: "Gere slides temáticos completos a partir de uma breve descrição do assunto.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Slides"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "diffit": {
    name: "Diffit",
    jobToBeDone: "Adaptação e diferenciação de materiais de leitura para diversos níveis.",
    tip: "Adapte o mesmo texto técnico para alunos em diferentes níveis de compreensão.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "eduaide-ai": {
    name: "Eduaide.AI",
    jobToBeDone: "Planejador de aulas e gerador de recursos educacionais ricos com IA.",
    tip: "Gere planos de aula detalhados, atividades de fixação e rúbricas de avaliação.",
    tags: {
      lessonPhase: ["Planejamento", "Avaliação"],
      outputFormat: ["Texto", "Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "education-copilot": {
    name: "Education Copilot",
    jobToBeDone: "Criação de planos de aula, apostilas e materiais didáticos rápidos.",
    tip: "Use para acelerar a estruturação de ementas e apostilas de cursos novos.",
    tags: {
      lessonPhase: ["Planejamento"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "explainpaper": {
    name: "Explainpaper",
    jobToBeDone: "Simplificação e explicação de termos complexos em artigos científicos selecionados.",
    tip: "Ajude alunos a entenderem artigos acadêmicos complexos explicando termos difíceis.",
    tags: {
      lessonPhase: ["Pesquisa", "Execução"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "fliki": {
    name: "Fliki",
    jobToBeDone: "Criação de vídeos a partir de textos e scripts com vozes realistas.",
    tip: "Transforme resumos de aula textuais em vídeos explicativos dinâmicos com narração.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo", "Áudio"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "gradescope": {
    name: "Gradescope",
    jobToBeDone: "Correção de provas físicas e digitais e análise detalhada de desempenho.",
    tip: "Agilize a correção de exames escritos escaneando as respostas dos alunos.",
    tags: {
      lessonPhase: ["Avaliação", "Rotinas Administrativas"],
      outputFormat: ["Texto", "Dados"],
      costType: "Freemium",
      costDetail: "Planos escolares pagos"
    }
  },
  "gptzero": {
    name: "GPTZero",
    jobToBeDone: "Detecção e análise de textos gerados por inteligência artificial.",
    tip: "Analise trabalhos e redações para apoiar discussões sobre integridade e ética em IA.",
    tags: {
      lessonPhase: ["Avaliação"],
      outputFormat: ["Texto", "Dados"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "hugging-face": {
    name: "Hugging Face",
    jobToBeDone: "Comunidade e biblioteca de modelos de inteligência artificial de código aberto.",
    tip: "Apresente aos alunos de computação e dados modelos de IA prontos para uso.",
    tags: {
      lessonPhase: ["Execução", "Pesquisa"],
      outputFormat: ["Código", "Dados"],
      costType: "Free",
      costDetail: "Código Aberto e Gratuito"
    }
  },
  "invideo": {
    name: "InVideo",
    jobToBeDone: "Criação e edição de vídeos profissionais baseados em roteiros rápidos.",
    tip: "Transforme ideias escritas em vídeos explicativos prontos com narração por IA.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "jasper": {
    name: "Jasper",
    jobToBeDone: "Assistente de IA focado em redação publicitária e marketing de conteúdo.",
    tip: "Ensine alunos de comunicação e marketing a estruturarem campanhas e posts otimizados.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "julius-ai": {
    name: "Julius AI",
    jobToBeDone: "Análise de planilhas, geração de gráficos e modelagem de dados estatísticos.",
    tip: "Faça upload de tabelas de laboratório e peça gráficos detalhados em segundos.",
    tags: {
      lessonPhase: ["Execução", "Pesquisa", "Avaliação"],
      outputFormat: ["Dados", "Imagem"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "kahoot": {
    name: "Kahoot!",
    jobToBeDone: "Plataforma de quiz baseada em jogos com foco em engajamento ativo.",
    tip: "Aplique questionários competitivos em tempo real para consolidar conceitos aprendidos.",
    tags: {
      lessonPhase: ["Avaliação", "Execução"],
      outputFormat: ["Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "midjourney": {
    name: "Midjourney",
    jobToBeDone: "Geração de imagens e ilustrações artísticas de alta qualidade com IA.",
    tip: "Ideal para criar ilustrações conceituais ricas para apostilas e materiais didáticos.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Imagem"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "nearpod": {
    name: "Nearpod",
    jobToBeDone: "Aulas interativas com realidade virtual, questionários e recursos em tempo real.",
    tip: "Monitore o progresso individual dos alunos à medida que avançam pelos slides interativos.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Slides", "Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "notion-ai": {
    name: "Notion AI",
    jobToBeDone: "Assistente de escrita e organização integrado aos documentos do Notion.",
    tip: "Resuma notas de aula, traduza textos ou gere tópicos de estudo integrados ao Notion.",
    tags: {
      lessonPhase: ["Planejamento", "Rotinas Administrativas"],
      outputFormat: ["Texto"],
      costType: "Paid",
      costDetail: "Planos pagos"
    }
  },
  "padlet": {
    name: "Padlet",
    jobToBeDone: "Mural digital colaborativo para compartilhamento de ideias, links e mídias.",
    tip: "Crie painéis onde equipes de alunos expõem os resultados de pesquisas e projetos.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Texto", "Imagem", "Links"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "phind": {
    name: "Phind",
    jobToBeDone: "Mecanismo de busca otimizado e assistente de IA focado em programação.",
    tip: "Use para tirar dúvidas técnicas sobre códigos e frameworks web em segundos.",
    tags: {
      lessonPhase: ["Pesquisa", "Execução"],
      outputFormat: ["Código", "Texto"],
      costType: "Free",
      costDetail: "Gratuito"
    }
  },
  "quillbot": {
    name: "Quillbot",
    jobToBeDone: "Reescrita, paráfrase e resumo de textos mantendo a coerência gramatical.",
    tip: "Auxilie alunos a reescreverem parágrafos longos ou melhorarem o vocabulário em redações.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "runway": {
    name: "Runway",
    jobToBeDone: "Geração e edição de vídeos criativos baseados em inteligência artificial.",
    tip: "Crie pequenos vídeos explicativos gerados a partir de imagens ou descrições breves.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Vídeo"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "schoolai": {
    name: "SchoolAI",
    jobToBeDone: "Assistentes de IA educacionais personalizados e monitoramento em tempo real.",
    tip: "Crie tutores de IA interativos sobre temas específicos e acompanhe o progresso das conversas.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "twee": {
    name: "Twee",
    jobToBeDone: "Criação de exercícios, testes e perguntas de interpretação para inglês.",
    tip: "Crie rapidamente questionários de leitura e gramática a partir de qualquer vídeo do YouTube.",
    tags: {
      lessonPhase: ["Planejamento", "Avaliação"],
      outputFormat: ["Quizzes", "Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "visme": {
    name: "Visme",
    jobToBeDone: "Criação de infográficos, relatórios e apresentações corporativas e visuais ricos.",
    tip: "Ideal para alunos apresentarem relatórios de projetos práticos de forma profissional.",
    tags: {
      lessonPhase: ["Execução", "Planejamento"],
      outputFormat: ["Slides", "Imagem"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "questionwell": {
    name: "QuestionWell",
    jobToBeDone: "Geração de perguntas de múltipla escolha a partir de textos inseridos.",
    tip: "Cole um artigo e gere dezenas de perguntas alinhadas a objetivos de aprendizagem.",
    tags: {
      lessonPhase: ["Planejamento", "Avaliação"],
      outputFormat: ["Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "clever": {
    name: "Clever",
    jobToBeDone: "Portal de login único para integrar e gerenciar softwares escolares.",
    tip: "Centralize todas as ferramentas digitais usadas na escola em uma única página acessível.",
    tags: {
      lessonPhase: ["Rotinas Administrativas"],
      outputFormat: ["Links"],
      costType: "Free",
      costDetail: "Gratuito para escolas"
    }
  },
  "baobab": {
    name: "Baobab",
    jobToBeDone: "Otimização de fluxos e documentação para planos de necessidades educacionais especiais.",
    tip: "Use para simplificar e organizar o plano de atendimento pedagógico a estudantes com necessidades específicas.",
    tags: {
      lessonPhase: ["Rotinas Administrativas", "Planejamento"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "kleveroo": {
    name: "Kleveroo",
    jobToBeDone: "Criação de jogos interativos de revisão em formato de Jeopardy e trivia.",
    tip: "Prepare atividades de revisão dinâmicas em grupo antes de exames importantes.",
    tags: {
      lessonPhase: ["Execução", "Avaliação"],
      outputFormat: ["Quizzes"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "gradingpal": {
    name: "GradingPal",
    jobToBeDone: "Auxílio na correção de avaliações alinhadas a rúbricas de competência.",
    tip: "Cadastre sua rúbrica técnica do SENAI e receba sugestões rápidas de notas e feedbacks.",
    tags: {
      lessonPhase: ["Avaliação"],
      outputFormat: ["Texto", "Dados"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "vocina": {
    name: "Vocina",
    jobToBeDone: "Plataforma de testes e avaliações orais baseada em inteligência artificial.",
    tip: "Excelente para avaliar a expressão verbal e compreensão de forma interativa e individual.",
    tags: {
      lessonPhase: ["Avaliação", "Execução"],
      outputFormat: ["Áudio", "Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "madlen": {
    name: "Madlen",
    jobToBeDone: "Assistente de IA focado em apoiar professores no planejamento curricular.",
    tip: "Use para estruturar cronogramas de disciplinas novas com objetivos de aprendizagem claros.",
    tags: {
      lessonPhase: ["Planejamento"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "dr-connor": {
    name: "Dr Connor",
    jobToBeDone: "Chatbot educacional desenhado para desenvolver o pensamento crítico dos alunos.",
    tip: "Apresente o bot aos alunos para debaterem teses estimulando o questionamento socrático.",
    tags: {
      lessonPhase: ["Execução", "Pesquisa"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "brainator": {
    name: "Brainator",
    jobToBeDone: "Geração rápida de quebra-cabeças, palavras cruzadas e fichas de exercícios.",
    tip: "Crie quebra-cabeças e atividades lúdicas contendo termos técnicos estudados na disciplina.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto", "Imagem"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "tikonote": {
    name: "TikoNote",
    jobToBeDone: "Estudo ativo utilizando a técnica de Feynman de explicações simplificadas.",
    tip: "Peça aos alunos para ensinarem conceitos complexos ao bot para testar sua própria compreensão.",
    tags: {
      lessonPhase: ["Execução", "Pesquisa"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "scorewise-ai": {
    name: "ScoreWise AI",
    jobToBeDone: "Auxílio na análise e correção automatizada de provas discursivas.",
    tip: "Apoie sua correção obtendo relatórios de acertos e desvios de conteúdo nas respostas.",
    tags: {
      lessonPhase: ["Avaliação"],
      outputFormat: ["Texto", "Dados"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "parlo": {
    name: "Parlo",
    jobToBeDone: "Assistente de ensino de IA integrado ao currículo escolar específico.",
    tip: "Configure as ementas oficiais e receba propostas de aulas alinhadas diretamente ao currículo.",
    tags: {
      lessonPhase: ["Planejamento", "Rotinas Administrativas"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "cochat": {
    name: "CoChat",
    jobToBeDone: "Criação de agentes de IA para pesquisa de literatura científica automatizada.",
    tip: "Crie bots que buscam artigos e preparam relatórios agendados sobre novos tópicos técnicos.",
    tags: {
      lessonPhase: ["Pesquisa", "Planejamento"],
      outputFormat: ["Texto", "Dados"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "ailitkit": {
    name: "AILitKit",
    jobToBeDone: "Geração de atividades de alfabetização e diferenciação a partir de textos.",
    tip: "Use para criar dinâmicas de leitura adaptadas para alunos com ritmos de aprendizagem distintos.",
    tags: {
      lessonPhase: ["Planejamento", "Execução"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "acuity-autoredact": {
    name: "Acuity AutoRedact",
    jobToBeDone: "Ocultação e anonimização automática de dados sensíveis em vídeos e documentos.",
    tip: "Ótimo para anonimizar vídeos de aulas práticas e projetos antes de publicar na web.",
    tags: {
      lessonPhase: ["Rotinas Administrativas"],
      outputFormat: ["Texto", "Vídeo"],
      costType: "Paid",
      costDetail: "Planos pagos corporativos"
    }
  },
  "lara": {
    name: "LARA",
    jobToBeDone: "Assistente de feedback formativo instantâneo para redações e atividades escritas.",
    tip: "Forneça sugestões de melhoria rápidas e detalhadas para os trabalhos dos alunos durante a aula.",
    tags: {
      lessonPhase: ["Avaliação", "Execução"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  },
  "tecadrise": {
    name: "TecAdRise",
    jobToBeDone: "Consultoria e implantação de automações de IA para educadores e formadores.",
    tip: "Ajuda na integração prática de fluxos de trabalho e ferramentas de IA sem complicação.",
    tags: {
      lessonPhase: ["Rotinas Administrativas", "Planejamento"],
      outputFormat: ["Texto", "Links"],
      costType: "Paid",
      costDetail: "Serviços pagos"
    }
  },
  "boxy-ai": {
    name: "Boxy AI",
    jobToBeDone: "Assistente de e-mail e mensagens que rascunha respostas automáticas.",
    tip: "Agilize sua comunicação com alunos e pais automatizando rascunhos de avisos.",
    tags: {
      lessonPhase: ["Rotinas Administrativas"],
      outputFormat: ["Texto"],
      costType: "Freemium",
      costDetail: "Gratuito com limitações"
    }
  }
};

// Heuristics for any minor or obscure tool not explicitly in our hand-curated list:
// Ensures they still get translated and validated correctly.
function getFallbackEnrichment(name, description) {
  const normalizedName = name.trim().toLowerCase();
  
  // Clean description or fallback
  const desc = (description || "Ferramenta de produtividade e apoio educacional").trim();
  
  let jobToBeDone = "Apoiar a rotina pedagógica e a produtividade de professores e alunos.";
  let tip = "Consulte o site oficial da ferramenta para explorar todas as suas funcionalidades práticas.";
  let lessonPhase = ["Execução"];
  let outputFormat = ["Texto"];
  let costType = "Freemium";
  let costDetail = "Gratuito com limitações";

  // Basic smart mapping from keywords in description or name
  if (normalizedName.includes("quiz") || normalizedName.includes("game") || normalizedName.includes("trivia") || desc.toLowerCase().includes("quiz") || desc.toLowerCase().includes("trivia")) {
    jobToBeDone = "Criar questionários e atividades de revisão interativas de forma dinâmica.";
    tip = "Ideal para fixar conceitos antes de provas de forma leve e engajadora.";
    lessonPhase = ["Execução", "Avaliação"];
    outputFormat = ["Quizzes"];
  } else if (normalizedName.includes("video") || normalizedName.includes("screen") || desc.toLowerCase().includes("video") || desc.toLowerCase().includes("screen")) {
    jobToBeDone = "Gravar a tela e editar videoaulas explicativas de forma simples.";
    tip = "Compartilhe gravações rápidas demonstrando tarefas no computador para guiar os alunos.";
    lessonPhase = ["Execução", "Planejamento"];
    outputFormat = ["Vídeo"];
  } else if (normalizedName.includes("design") || normalizedName.includes("draw") || normalizedName.includes("art") || desc.toLowerCase().includes("design") || desc.toLowerCase().includes("draw") || desc.toLowerCase().includes("image")) {
    jobToBeDone = "Criar designs visuais, ilustrações e layouts modernos para as aulas.";
    tip = "Crie apresentações e banners modernos para ilustrar seus conteúdos técnicos.";
    lessonPhase = ["Planejamento", "Execução"];
    outputFormat = ["Imagem"];
  } else if (normalizedName.includes("write") || normalizedName.includes("text") || normalizedName.includes("note") || desc.toLowerCase().includes("write") || desc.toLowerCase().includes("text") || desc.toLowerCase().includes("note")) {
    jobToBeDone = "Redigir resumos, artigos e planos de aula estruturados de forma rápida.";
    tip = "Utilize como base para construir rascunhos de seus materiais pedagógicos.";
    lessonPhase = ["Planejamento", "Execução"];
    outputFormat = ["Texto"];
  } else if (normalizedName.includes("audio") || normalizedName.includes("voice") || normalizedName.includes("podcast") || desc.toLowerCase().includes("audio") || desc.toLowerCase().includes("voice") || desc.toLowerCase().includes("podcast")) {
    jobToBeDone = "Gerar narrações e áudios com inteligência artificial para aulas.";
    tip = "Crie podcasts rápidos com tópicos importantes para os alunos revisarem no caminho.";
    lessonPhase = ["Execução"];
    outputFormat = ["Áudio"];
  } else if (normalizedName.includes("code") || normalizedName.includes("dev") || normalizedName.includes("program") || desc.toLowerCase().includes("code") || desc.toLowerCase().includes("program")) {
    jobToBeDone = "Auxiliar no desenvolvimento de códigos, scripts e soluções de programação.";
    tip = "Ajude os alunos a identificarem bugs simples em seus códigos durante a prática.";
    lessonPhase = ["Execução"];
    outputFormat = ["Código"];
  } else if (normalizedName.includes("sheet") || normalizedName.includes("data") || normalizedName.includes("anal") || desc.toLowerCase().includes("data") || desc.toLowerCase().includes("anal")) {
    jobToBeDone = "Analisar dados estatísticos e gerar relatórios visuais com planilhas.";
    tip = "Excelente para tabular notas ou feedbacks de avaliações de forma eficiente.";
    lessonPhase = ["Avaliação", "Rotinas Administrativas"];
    outputFormat = ["Dados"];
  } else if (normalizedName.includes("lms") || normalizedName.includes("school") || normalizedName.includes("class") || desc.toLowerCase().includes("lms") || desc.toLowerCase().includes("school") || desc.toLowerCase().includes("class")) {
    jobToBeDone = "Gerenciar turmas, tarefas e centralizar a comunicação da escola.";
    tip = "Mantenha todas as atividades estruturadas em um único painel de comunicação.";
    lessonPhase = ["Rotinas Administrativas", "Planejamento"];
    outputFormat = ["Links"];
  }

  // Cost type heuristic
  if (desc.toLowerCase().includes("open source") || desc.toLowerCase().includes("open-source") || desc.toLowerCase().includes("free online")) {
    costType = "Free";
    costDetail = "Gratuito e de código aberto";
  } else if (desc.toLowerCase().includes("paid") || desc.toLowerCase().includes("subscription")) {
    costType = "Paid";
    costDetail = "Planos pagos";
  } else if (desc.toLowerCase().includes("free trial") || desc.toLowerCase().includes("trial")) {
    costType = "Trial";
    costDetail = "Teste gratuito por tempo limitado";
  }

  return { name, jobToBeDone, tip, tags: { lessonPhase, outputFormat, costType, costDetail } };
}

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

function cleanAndValidateLengths(tool) {
  // Ensure jobToBeDone is <= 12 words
  if (tool.jobToBeDone) {
    const words = tool.jobToBeDone.trim().split(/\s+/);
    if (words.length > 12) {
      tool.jobToBeDone = words.slice(0, 11).join(' ') + '...';
    }
  }
  // Ensure tip is <= 20 words
  if (tool.tip) {
    const words = tool.tip.trim().split(/\s+/);
    if (words.length > 20) {
      tool.tip = words.slice(0, 19).join(' ') + '.';
    }
  }
}

async function main() {
  if (!fs.existsSync(TOOLS_PATH)) {
    console.error('❌ data/tools.json not found');
    process.exit(1);
  }

  const content = fs.readFileSync(TOOLS_PATH, 'utf8');

  // Locate where the first array ends
  const boundaryIndex = content.indexOf('\n]\n\n{');
  let originalPart = '';
  let newPart = '';

  if (boundaryIndex !== -1) {
    originalPart = content.slice(0, boundaryIndex + 2);
    newPart = content.slice(boundaryIndex + 2).trim();
  } else {
    const match = content.match(/\]\s*\n\s*\{/);
    if (match) {
      const idx = match.index;
      originalPart = content.slice(0, idx + 1);
      newPart = content.slice(idx + 1).trim();
    } else {
      console.error('❌ Could not locate the split boundary between original tools and new tools metadata.');
      process.exit(1);
    }
  }

  let originalTools;
  let newMeta;

  try {
    originalTools = JSON.parse(originalPart);
  } catch (e) {
    console.error('❌ Error parsing original tools part:', e.message);
    process.exit(1);
  }

  try {
    newMeta = JSON.parse(newPart);
  } catch (e) {
    console.error('❌ Error parsing new tools metadata part:', e.message);
    process.exit(1);
  }

  const newItems = newMeta.items || [];
  console.log(`Original tools in catalog: ${originalTools.length}`);
  console.log(`Pasted raw tools: ${newItems.length}`);

  // Normalization maps to clean up duplicates from the raw list (e.g. ChatPDF vs chatpdf, Google Bard vs Gemini)
  const canonicalIds = {
    "google-bard": "gemini",
    "bard": "gemini",
    "gpt-4": "chatgpt",
    "chatgpt-for-google": "chatgpt",
    "claude-2": "claude",
    "anthropic": "claude",
    "gamma-app": "gamma",
    "suno-com": "suno",
    "dall-e-3": "dall-e"
  };

  function getCanonicalId(name) {
    let cleanId = name
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with dash
      .replace(/^-+|-+$/g, ''); // trim dashes from start/end
      
    // Apply aliases
    if (canonicalIds[cleanId]) {
      cleanId = canonicalIds[cleanId];
    }
    return cleanId;
  }

  // Set of original IDs to prevent duplicates
  const existingIds = new Set(originalTools.map(t => t.id));
  const finalTools = [...originalTools];
  const addedIds = new Set(existingIds);

  let enrichedCount = 0;

  for (const item of newItems) {
    if (!item.name || item.name.trim() === '') continue;

    const id = getCanonicalId(item.name);
    
    // Skip if already in the list
    if (addedIds.has(id)) {
      continue;
    }

    // Get enrichment details (curated first, fallback second)
    let enrichment = toolDictionary[id];
    if (!enrichment) {
      // Try by lowercase name match
      enrichment = toolDictionary[item.name.toLowerCase().trim()];
    }

    if (!enrichment) {
      enrichment = getFallbackEnrichment(item.name, item.description);
    }

    const cleanName = enrichment.name || item.name;
    const cleanUrl = item.url ? item.url.trim() : (enrichment.url || "https://example.com");

    const enrichedTool = {
      id: id,
      name: cleanName,
      url: cleanUrl,
      jobToBeDone: enrichment.jobToBeDone,
      tags: {
        lessonPhase: enrichment.tags.lessonPhase,
        outputFormat: enrichment.tags.outputFormat,
        costType: enrichment.tags.costType,
        costDetail: enrichment.tags.costDetail || "Gratuita com limitações"
      },
      tip: enrichment.tip,
      screenshotUrl: `/images/tools/default.jpg` // fallback to our generated default banner
    };

    // Clean and validate word counts just in case
    cleanAndValidateLengths(enrichedTool);

    finalTools.push(enrichedTool);
    addedIds.add(id);
    enrichedCount++;
  }

  console.log(`De-duplicated and added ${enrichedCount} new tools.`);
  console.log(`Total final tools in catalog: ${finalTools.length}`);

  // Write back to tools.json
  const finalContent = JSON.stringify(finalTools, null, 2);
  fs.writeFileSync(TOOLS_PATH, finalContent, 'utf8');
  console.log(`✅ successfully updated ${TOOLS_PATH}`);
}

main();

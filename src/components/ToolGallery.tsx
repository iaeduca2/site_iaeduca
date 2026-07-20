import { useEffect, useMemo, useRef, useState } from "react";
import type { Tool } from "../lib/tools";
import {
	formatCostType,
	getUniqueValues,
	smartFilterTools,
} from "../lib/tool-filters";
import { parsePrompt } from "../lib/prompt-parser";

/* Icon mapping for tools */
const toolIcons: Record<string, string> = {
	ChatGPT: "💬",
	Claude: "🤖",
	Perplexity: "🔍",
	Gemini: "✨",
	Copilot: "🚀",
	"DALL-E": "🖼️",
	Midjourney: "🎨",
	Runway: "🎬",
	ElevenLabs: "🎙️",
	Synthesia: "🎥",
	Canva: "📐",
	Typeform: "📋",
	Quillbot: "✍️",
	Grammarly: "📝",
	Jasper: "💡",
};

function getIconForTool(toolName: string): string {
	return toolIcons[toolName] || "🛠️";
}

const PRESET_PROMPTS = [
	{
		label: "🎮 Quero fazer uma aula gamificada",
		prompt: "Quero fazer uma aula gamificada",
	},
	{
		label: "📊 Quero criar slides para minha aula",
		prompt: "Quero criar slides para minha aula",
	},
	{
		label: "🎨 Ferramentas gratuitas para gerar imagens",
		prompt: "Ferramentas gratuitas para gerar imagens",
	},
	{
		label: "📝 Ajuda para elaborar um plano de aula",
		prompt: "Ajuda para elaborar um plano de aula",
	},
	{
		label: "📑 Quero criar testes e provas para os alunos",
		prompt: "Quero criar testes e provas para os alunos",
	},
	{
		label: "🔍 Ferramentas para buscar e pesquisar conteúdos",
		prompt: "Ferramentas para buscar e pesquisar conteudos",
	},
	{
		label: "🎙️ Recursos de áudio e podcast para aula",
		prompt: "Recursos de audio e podcast para a aula",
	},
	{
		label: "🎬 Ferramentas de vídeo para engajar a turma",
		prompt: "Ferramentas de video para engajar a turma",
	},
];

interface ToolGalleryProps {
	tools: Tool[];
}

export default function ToolGallery({ tools }: ToolGalleryProps) {
	const [rawPrompt, setRawPrompt] = useState("");
	const [submittedPrompt, setSubmittedPrompt] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	const [manualQuery, setManualQuery] = useState("");
	const [manualPhase, setManualPhase] = useState("all");
	const [manualFormat, setManualFormat] = useState("all");
	const [manualCostType, setManualCostType] = useState("all");
	const [showManualFilters, setShowManualFilters] = useState(false);
	const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

	const lessonPhases = useMemo(() => getUniqueValues(tools, "lessonPhase"), [tools]);
	const outputFormats = useMemo(() => getUniqueValues(tools, "outputFormat"), [tools]);

	// Extract filters from the SUBMITTED prompt only
	const parsedResult = useMemo(() => {
		return parsePrompt(submittedPrompt, lessonPhases, outputFormats);
	}, [submittedPrompt, lessonPhases, outputFormats]);

	// Handle prompt submission
	const handleSubmitPrompt = (textToSubmit?: string) => {
		const targetPrompt = textToSubmit !== undefined ? textToSubmit : rawPrompt;
		if (targetPrompt.trim().length === 0) return;

		setIsProcessing(true);
		setTimeout(() => {
			setSubmittedPrompt(targetPrompt);
			setIsProcessing(false);
		}, 450);
	};

	const handlePresetClick = (presetPrompt: string) => {
		setRawPrompt(presetPrompt);
		handleSubmitPrompt(presetPrompt);
	};

	// Effective active filters
	const isPromptSubmitted = submittedPrompt.trim().length > 0;
	const activePhase = isPromptSubmitted ? parsedResult.phase : manualPhase;
	const activeFormat = isPromptSubmitted ? parsedResult.format : manualFormat;
	const activeCostType = isPromptSubmitted ? parsedResult.costType : manualCostType;
	const activeQuery = isPromptSubmitted ? parsedResult.query : manualQuery;

	// Smart Filter with Fallback Strategy
	const filterResult = useMemo(
		() =>
			smartFilterTools(tools, {
				query: activeQuery,
				phase: activePhase,
				format: activeFormat,
				costType: activeCostType,
			}),
		[tools, activeQuery, activePhase, activeFormat, activeCostType],
	);

	const filteredTools = filterResult.tools;

	const resetAll = () => {
		setRawPrompt("");
		setSubmittedPrompt("");
		setManualQuery("");
		setManualPhase("all");
		setManualFormat("all");
		setManualCostType("all");
	};

	const selectedTool = useMemo(
		() => tools.find((tool) => tool.id === selectedToolId) ?? null,
		[selectedToolId, tools],
	);

	const hasActiveFilters =
		isPromptSubmitted ||
		manualQuery.trim().length > 0 ||
		manualPhase !== "all" ||
		manualFormat !== "all" ||
		manualCostType !== "all";

	const selectBaseClass =
		"rounded-md border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:ring-2 focus:ring-primary/20";
	const selectActiveClass = "border-primary bg-primary-tint/30";
	const selectIdleClass = "border-border";

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (selectedTool && !dialog.open) {
			dialog.showModal();
			return;
		}

		if (!selectedTool && dialog.open) {
			dialog.close();
			lastTriggerRef.current?.focus();
		}
	}, [selectedTool]);

	const closeDialog = () => {
		setSelectedToolId(null);
	};

	return (
		<section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
			<div className="max-w-3xl">
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
					Hub IA Educa
				</p>
				<h1 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
					Ferramentas de IA para a sala de aula
				</h1>
				<p className="mt-4 text-base leading-7 text-ink-muted md:text-lg">
					Um catálogo curado de ferramentas de Inteligência Artificial para apoiar
					o planejamento, a execução e a avaliação das suas aulas.
				</p>
			</div>

			{/* NAVEGAÇÃO / BUSCA CONVERSACIONAL ESTILO CHAT */}
			<div className="mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-white to-primary-tint/20 p-5 shadow-[0_8px_30px_rgba(22,65,148,0.06)] md:p-6">
				{/* Top Bar do Chat com Botão "Filtros" */}
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 pb-3">
					<div className="flex items-center gap-2">
						<span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-sm">
							✨
						</span>
						<span className="text-xs font-bold uppercase tracking-wider text-primary">
							Busca Inteligente por Prompt
						</span>
					</div>

					{/* Botão de Filtros Manuais com rótulo "Filtros" */}
					<button
						type="button"
						onClick={() => setShowManualFilters(!showManualFilters)}
						className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer ${
							showManualFilters
								? "border-primary bg-primary text-white"
								: "border-primary/30 bg-white text-primary hover:border-primary hover:bg-primary-tint/50"
						}`}
					>
						<span>🎛️ Filtros</span>
						<span className="text-xs">{showManualFilters ? "▲" : "▼"}</span>
					</button>
				</div>

				{/* Campo de Input estilo Chat Prompt */}
				<div className="relative rounded-xl border-2 border-border bg-white shadow-sm transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
					<textarea
						value={rawPrompt}
						onChange={(e) => setRawPrompt(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmitPrompt();
							}
						}}
						placeholder="Escreva como em um chat e pressione Enter... Ex: 'Quero fazer uma aula gamificada'"
						rows={2}
						className="w-full resize-none bg-transparent px-4 py-3.5 pr-28 text-sm md:text-base text-ink outline-none placeholder:text-ink-muted/60"
					/>

					<div className="absolute right-3 bottom-3 flex items-center gap-2">
						{rawPrompt.trim().length > 0 && (
							<button
								type="button"
								onClick={() => {
									setRawPrompt("");
									setSubmittedPrompt("");
								}}
								title="Limpar prompt"
								className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-neutral-bg hover:text-ink transition cursor-pointer"
							>
								✕
							</button>
						)}

						<button
							type="button"
							onClick={() => handleSubmitPrompt()}
							disabled={isProcessing || rawPrompt.trim().length === 0}
							className={`inline-flex items-center justify-center gap-1.5 min-w-[80px] rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition-all shadow-md ${
								rawPrompt.trim().length > 0 && !isProcessing
									? "bg-primary hover:bg-primary-hover cursor-pointer"
									: "bg-primary/40 cursor-not-allowed"
							}`}
							title="Clique para processar o prompt"
						>
							{isProcessing ? (
								<svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
									<path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
								</svg>
							) : (
								<>
									<span>Enviar</span>
									<span className="text-sm">✨</span>
								</>
							)}
						</button>
					</div>
				</div>

				{/* Exclusivamente a Barra Linear Shimmer Minimalista */}
				{isProcessing && (
					<div className="mt-4 flex items-center justify-center py-2 animate-fadeInUp">
						<div className="relative w-full max-w-sm h-1 overflow-hidden rounded-full bg-primary-tint">
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer"></div>
						</div>
					</div>
				)}

				{/* 1. FILTROS RECONHECIDOS NO PROMPT */}
				{!isProcessing && isPromptSubmitted && parsedResult.detectedChips.length > 0 && (
					<div className="mt-4 rounded-lg border border-primary/15 bg-primary-tint/40 p-3 animate-fadeInUp">
						<div className="flex flex-wrap items-center justify-between gap-2 mb-2">
							<span className="text-xs font-semibold text-primary flex items-center gap-1">
								🎯 Filtros reconhecidos no seu prompt:
							</span>
						</div>

						<div className="flex flex-wrap gap-2">
							{parsedResult.detectedChips.map((chip) => (
								<span
									key={chip.label}
									className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-2xs"
								>
									<span>{chip.label}</span>
								</span>
							))}
						</div>
					</div>
				)}

				{/* 2. ACCORDION DE FILTROS MANUAIS */}
				{showManualFilters && (
					<div className="mt-4 pt-4 border-t border-border/80 grid gap-3 md:grid-cols-4 animate-fadeInUp">
						<label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
							Busca textual direta
							<input
								value={manualQuery}
								onChange={(e) => setManualQuery(e.target.value)}
								type="search"
								placeholder="Termo livre..."
								className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							/>
						</label>

						<label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
							Fase da aula
							<select
								value={manualPhase}
								onChange={(e) => setManualPhase(e.target.value)}
								className={`${selectBaseClass} ${
									manualPhase === "all" ? selectIdleClass : selectActiveClass
								}`}
							>
								<option value="all">Todas</option>
								{lessonPhases.map((value) => (
									<option key={value} value={value}>
										{value}
									</option>
								))}
							</select>
						</label>

						<label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
							Formato de saída
							<select
								value={manualFormat}
								onChange={(e) => setManualFormat(e.target.value)}
								className={`${selectBaseClass} ${
									manualFormat === "all" ? selectIdleClass : selectActiveClass
								}`}
							>
								<option value="all">Todos</option>
								{outputFormats.map((value) => (
									<option key={value} value={value}>
										{value}
									</option>
								))}
							</select>
						</label>

						<label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
							Custo
							<select
								value={manualCostType}
								onChange={(e) => setManualCostType(e.target.value)}
								className={`${selectBaseClass} ${
									manualCostType === "all" ? selectIdleClass : selectActiveClass
								}`}
							>
								<option value="all">Todos</option>
								<option value="Free">Free</option>
								<option value="Freemium">Freemium</option>
								<option value="Trial">Trial</option>
								<option value="Paid">Paid</option>
							</select>
						</label>
					</div>
				)}

				{/* 3. SUGESTÕES DE PROMPTS PRONTOS */}
				<div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-2">
					<span className="text-xs font-medium text-ink-muted">Exemplos de professores:</span>
					{PRESET_PROMPTS.map((preset) => (
						<button
							key={preset.label}
							type="button"
							onClick={() => handlePresetClick(preset.prompt)}
							disabled={isProcessing}
							className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-ink hover:border-primary hover:bg-primary-tint/50 hover:text-primary transition cursor-pointer disabled:opacity-50"
						>
							{preset.label}
						</button>
					))}
				</div>

				{/* Rodapé de Estatísticas e Botão de Limpar */}
				<div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted border-t border-border/40 pt-3">
					<p className="font-semibold text-ink">
						{filteredTools.length} de {tools.length} ferramentas encontradas
					</p>

					{hasActiveFilters && (
						<button
							type="button"
							onClick={resetAll}
							className="rounded-full border border-border px-3 py-1 font-semibold text-accent hover:border-accent hover:bg-accent-tint transition cursor-pointer"
						>
							Limpar prompt e filtros ✕
						</button>
					)}
				</div>
			</div>

			{/* Mensagem de Feedback de Fallback Inteligente */}
			{!isProcessing && filterResult.isFallback && hasActiveFilters && (
				<div className="mt-6 rounded-xl border border-accent/30 bg-accent-tint/50 p-4 text-xs font-semibold text-accent-dark flex items-center gap-2 shadow-2xs">
					<span className="text-base">💡</span>
					<span>{filterResult.fallbackReason}</span>
				</div>
			)}

			{/* GRID DE CARDS DE FERRAMENTAS */}
			<div className="mt-8 grid gap-5 auto-fit-grid">
				{filteredTools.map((tool) => (
					<article
						key={tool.id}
						className="group overflow-hidden rounded-lg border border-border bg-surface transition hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(22,65,148,0.08)] hover:bg-white/50"
					>
						<div className="relative aspect-[16/10] overflow-hidden bg-neutral-bg">
							<img
								src={tool.screenshotUrl}
								alt={`Captura da página inicial de ${tool.name}`}
								className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
							/>
							<div className="absolute top-3 left-3 rounded-full bg-white shadow-md p-2 text-lg">
								{getIconForTool(tool.name)}
							</div>
							<span className="absolute top-3 right-3 rounded-full bg-primary shadow-md px-2.5 py-1 text-xs font-semibold text-white">
								{formatCostType(tool.tags.costType)}
							</span>
						</div>

						<div className="space-y-5 p-6">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h2 className="text-fluid-lg font-bold text-ink">{tool.name}</h2>
									<p className="mt-1 text-fluid-sm text-ink-muted">{tool.jobToBeDone}</p>
								</div>
							</div>

							<div className="flex flex-wrap gap-2">
								{tool.tags.lessonPhase.map((tag) => (
									<span
										key={tag}
										className="rounded-full bg-neutral-bg px-2.5 py-1 text-xs font-medium text-ink-muted"
									>
										{tag}
									</span>
								))}
								{tool.tags.outputFormat.map((tag) => (
									<span
										key={tag}
										className="rounded-full bg-accent-tint px-2.5 py-1 text-xs font-medium text-accent-hover"
									>
										{tag}
									</span>
								))}
							</div>

							<p className="rounded-md border border-accent/20 bg-accent-tint p-3 text-sm text-ink-muted">
								<strong className="font-semibold text-accent">Dica SENAI:</strong>{" "}
								{tool.tip}
							</p>

							<div className="flex flex-wrap gap-3">
								<button
									type="button"
									onClick={(event) => {
										lastTriggerRef.current = event.currentTarget;
										setSelectedToolId(tool.id);
									}}
									className="inline-flex items-center rounded-md border border-border bg-white px-3.5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-tint cursor-pointer"
								>
									Ver detalhes
								</button>
								<a
									href={tool.url}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
								>
									Acessar ferramenta
								</a>
							</div>
						</div>
					</article>
				))}
			</div>

			{/* DIALOG DE DETALHES DA FERRAMENTA */}
			{selectedTool && (
				<dialog
					ref={dialogRef}
					onCancel={(event) => {
						event.preventDefault();
						closeDialog();
					}}
					onClick={(event) => {
						if (event.target === event.currentTarget) {
							closeDialog();
						}
					}}
					className="rounded-lg border border-border bg-surface p-0 shadow-[0_24px_80px_rgba(27,31,39,0.28)] backdrop-blur-md animate-scaleIn"
				>
					<div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
						<div className="bg-neutral-bg">
							<img
								src={selectedTool.screenshotUrl}
								alt={`Captura da página inicial de ${selectedTool.name}`}
								className="h-full w-full object-cover"
							/>
						</div>

						<div className="space-y-4 p-6 md:p-7">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
										Detalhe da ferramenta
									</p>
									<h2 className="mt-2 text-fluid-lg font-bold text-ink">
										{selectedTool.name}
									</h2>
								</div>
								<button
									type="button"
									onClick={closeDialog}
									className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-ink-muted transition hover:border-primary hover:text-primary cursor-pointer"
								>
									Fechar
								</button>
							</div>

							<p className="text-sm leading-6 text-ink-muted">
								{selectedTool.jobToBeDone}
							</p>

							<div className="flex flex-wrap gap-2">
								{selectedTool.tags.lessonPhase.map((tag) => (
									<span
										key={tag}
										className="rounded-full bg-neutral-bg px-2.5 py-1 text-xs font-medium text-ink-muted"
									>
										{tag}
									</span>
								))}
								{selectedTool.tags.outputFormat.map((tag) => (
									<span
										key={tag}
										className="rounded-full bg-accent-tint px-2.5 py-1 text-xs font-medium text-accent-hover"
									>
										{tag}
									</span>
								))}
								<span className="rounded-full bg-primary-tint px-2.5 py-1 text-xs font-semibold text-primary">
									{formatCostType(selectedTool.tags.costType)}
								</span>
							</div>

							<div className="space-y-2 rounded-lg border border-border bg-white p-4">
								<p className="text-sm font-semibold text-ink">Dica SENAI</p>
								<p className="text-sm leading-6 text-ink-muted">{selectedTool.tip}</p>
							</div>

							<a
								href={selectedTool.url}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-smooth hover:bg-primary-hover"
							>
								Acessar ferramenta
							</a>
						</div>
					</div>
				</dialog>
			)}
		</section>
	);
}

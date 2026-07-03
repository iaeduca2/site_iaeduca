import { useEffect, useMemo, useRef, useState } from "react";
import type { Tool } from "../lib/tools";
import {
	filterTools,
	formatCostType,
	getUniqueValues,
} from "../lib/tool-filters";

interface ToolGalleryProps {
	tools: Tool[];
}

export default function ToolGallery({ tools }: ToolGalleryProps) {
	const [query, setQuery] = useState("");
	const [phase, setPhase] = useState("all");
	const [format, setFormat] = useState("all");
	const [costType, setCostType] = useState("all");
	const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

	const lessonPhases = useMemo(() => getUniqueValues(tools, "lessonPhase"), [tools]);
	const outputFormats = useMemo(() => getUniqueValues(tools, "outputFormat"), [tools]);

	const filteredTools = useMemo(
		() => filterTools(tools, { query, phase, format, costType }),
		[costType, format, phase, query, tools],
	);

	const resetFilters = () => {
		setQuery("");
		setPhase("all");
		setFormat("all");
		setCostType("all");
	};

	const selectedTool = useMemo(
		() => tools.find((tool) => tool.id === selectedToolId) ?? null,
		[selectedToolId, tools],
	);

	const hasActiveFilters =
		query.trim().length > 0 || phase !== "all" || format !== "all" || costType !== "all";

	const activeFilterChips = [
		query.trim().length > 0
			? {
				label: `Busca: ${query.trim()}`,
				onClear: () => setQuery(""),
			}
			: null,
		phase !== "all"
			? {
				label: `Fase: ${phase}`,
				onClear: () => setPhase("all"),
			}
			: null,
		format !== "all"
			? {
				label: `Formato: ${format}`,
				onClear: () => setFormat("all"),
			}
			: null,
		costType !== "all"
			? {
				label: `Custo: ${formatCostType(costType as "Free" | "Freemium" | "Paid" | "Trial")}`,
				onClear: () => setCostType("all"),
			}
			: null,
	].filter(Boolean) as Array<{ label: string; onClear: () => void }>;

	const selectBaseClass =
		"rounded-md border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:ring-2 focus:ring-primary/20";
	const selectActiveClass = "border-primary bg-primary-tint/30";
	const selectIdleClass = "border-border";

	useEffect(() => {
		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}

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

			<div className="mt-8 rounded-lg border border-border bg-surface p-4 shadow-[0_1px_0_rgba(27,31,39,0.04)] md:p-5">
				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Buscar
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							type="search"
							placeholder="Ex.: slides, avaliação, pesquisa..."
							className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
					</label>

					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Fase da aula
						<select
							value={phase}
							onChange={(event) => setPhase(event.target.value)}
							className={`${selectBaseClass} ${
								phase === "all" ? selectIdleClass : selectActiveClass
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

					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Formato de saída
						<select
							value={format}
							onChange={(event) => setFormat(event.target.value)}
							className={`${selectBaseClass} ${
								format === "all" ? selectIdleClass : selectActiveClass
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

					<label className="flex flex-col gap-2 text-sm font-medium text-ink">
						Custo
						<select
							value={costType}
							onChange={(event) => setCostType(event.target.value)}
							className={`${selectBaseClass} ${
								costType === "all" ? selectIdleClass : selectActiveClass
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

				<div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
					<p className="font-medium text-ink">
						{filteredTools.length} de {tools.length} ferramentas visíveis
					</p>
					<button
						type="button"
						onClick={resetFilters}
						disabled={!hasActiveFilters}
						className="rounded-full border border-border px-3 py-1.5 font-medium text-primary transition hover:border-primary hover:bg-primary-tint disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-transparent"
					>
						Limpar filtros
					</button>
				</div>

				{activeFilterChips.length > 0 ? (
					<div className="mt-4 flex flex-wrap gap-2">
						{activeFilterChips.map((chip) => (
							<button
								key={chip.label}
								type="button"
								onClick={chip.onClear}
								className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-tint px-3 py-1.5 text-sm font-medium text-primary transition hover:border-primary hover:bg-white"
							>
								<span>{chip.label}</span>
								<span aria-hidden="true" className="text-base leading-none">
									×
								</span>
							</button>
						))}
					</div>
				) : null}
			</div>

			<div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{filteredTools.map((tool) => (
					<article
						key={tool.id}
						className="group overflow-hidden rounded-lg border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(22,65,148,0.08)]"
					>
						<div className="aspect-[16/10] overflow-hidden bg-neutral-bg">
							<img
								src={tool.screenshotUrl}
								alt={`Captura da página inicial de ${tool.name}`}
								className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
							/>
						</div>

						<div className="space-y-4 p-5">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h2 className="text-lg font-bold text-ink">{tool.name}</h2>
									<p className="mt-1 text-sm text-ink-muted">{tool.jobToBeDone}</p>
								</div>
								<span className="rounded-full bg-primary-tint px-2.5 py-1 text-xs font-semibold text-primary">
									{formatCostType(tool.tags.costType)}
								</span>
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

							<p className="text-sm text-ink-muted">
								<strong className="font-semibold text-ink">Dica SENAI:</strong>{" "}
								{tool.tip}
							</p>

							<div className="flex flex-wrap gap-3">
								<button
									type="button"
									onClick={(event) => {
										lastTriggerRef.current = event.currentTarget;
										setSelectedToolId(tool.id);
									}}
									className="inline-flex items-center rounded-md border border-border bg-white px-3.5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-tint"
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

			{filteredTools.length === 0 ? (
				<div className="mt-8 rounded-lg border border-border bg-surface p-6 text-sm text-ink-muted">
					Nenhuma ferramenta encontrada com os filtros atuais.
				</div>
			) : null}

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
				className="w-[min(92vw,48rem)] rounded-lg border border-border bg-surface p-0 shadow-[0_24px_80px_rgba(27,31,39,0.28)] backdrop:bg-black/50"
			>
				{selectedTool ? (
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
									<h2 className="mt-2 text-2xl font-bold text-ink">
										{selectedTool.name}
									</h2>
								</div>
								<button
									type="button"
									onClick={closeDialog}
									className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-ink-muted transition hover:border-primary hover:text-primary"
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
								className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
							>
								Acessar ferramenta
							</a>
						</div>
					</div>
				) : null}
			</dialog>
		</section>
	);
}

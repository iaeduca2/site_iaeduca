import { useMemo, useState } from "react";
import type { Tool } from "../lib/tools";

interface ToolGalleryProps {
	tools: Tool[];
}

function getUniqueValues(tools: Tool[], key: "lessonPhase" | "outputFormat") {
	return [...new Set(tools.flatMap((tool) => tool.tags[key]))].sort((left, right) =>
		left.localeCompare(right, "pt-BR"),
	);
}

function matchesCost(tool: Tool, costType: string) {
	return costType === "all" || tool.tags.costType === costType;
}

export default function ToolGallery({ tools }: ToolGalleryProps) {
	const [query, setQuery] = useState("");
	const [phase, setPhase] = useState("all");
	const [format, setFormat] = useState("all");
	const [costType, setCostType] = useState("all");

	const lessonPhases = useMemo(() => getUniqueValues(tools, "lessonPhase"), [tools]);
	const outputFormats = useMemo(() => getUniqueValues(tools, "outputFormat"), [tools]);

	const filteredTools = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();

		return tools.filter((tool) => {
			const matchesQuery =
				normalizedQuery.length === 0 ||
				tool.name.toLowerCase().includes(normalizedQuery) ||
				tool.jobToBeDone.toLowerCase().includes(normalizedQuery) ||
				tool.tip.toLowerCase().includes(normalizedQuery);
			const matchesPhase = phase === "all" || tool.tags.lessonPhase.includes(phase);
			const matchesFormat = format === "all" || tool.tags.outputFormat.includes(format);
			const matchesCostType = matchesCost(tool, costType);

			return matchesQuery && matchesPhase && matchesFormat && matchesCostType;
		});
	}, [costType, format, phase, query, tools]);

	const resetFilters = () => {
		setQuery("");
		setPhase("all");
		setFormat("all");
		setCostType("all");
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
							className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
							className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
							className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
					<p>
						{filteredTools.length} de {tools.length} ferramentas visíveis
					</p>
					<button
						type="button"
						onClick={resetFilters}
						className="rounded-full border border-border px-3 py-1.5 font-medium text-primary transition hover:border-primary hover:bg-primary-tint"
					>
						Limpar filtros
					</button>
				</div>
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
									{tool.tags.costType}
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

							<a
								href={tool.url}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
							>
								Acessar ferramenta
							</a>
						</div>
					</article>
				))}
			</div>

			{filteredTools.length === 0 ? (
				<div className="mt-8 rounded-lg border border-border bg-surface p-6 text-sm text-ink-muted">
					Nenhuma ferramenta encontrada com os filtros atuais.
				</div>
			) : null}
		</section>
	);
}

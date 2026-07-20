import type { CostType, Tool } from "./tools";

export type ToolFilterState = {
	query: string;
	phase: string;
	format: string;
	costType: string;
};

export interface FilterToolsResult {
	tools: Tool[];
	isFallback: boolean;
	fallbackReason?: string;
}

export function getUniqueValues(
	tools: Tool[],
	key: "lessonPhase" | "outputFormat",
): string[] {
	return [...new Set(tools.flatMap((tool) => tool.tags[key]))].sort((left, right) =>
		left.localeCompare(right, "pt-BR"),
	);
}

export function formatCostType(costType: CostType): string {
	switch (costType) {
		case "Free":
			return "Gratuita";
		case "Freemium":
			return "Freemium";
		case "Trial":
			return "Teste grátis";
		case "Paid":
			return "Paga";
		default:
			return costType;
	}
}

export function filterTools(tools: Tool[], filters: ToolFilterState): Tool[] {
	const normalizedQuery = filters.query.trim().toLowerCase();

	return tools.filter((tool) => {
		const matchesQuery =
			normalizedQuery.length === 0 ||
			tool.name.toLowerCase().includes(normalizedQuery) ||
			tool.jobToBeDone.toLowerCase().includes(normalizedQuery) ||
			tool.tip.toLowerCase().includes(normalizedQuery);
		const matchesPhase = filters.phase === "all" || tool.tags.lessonPhase.includes(filters.phase);
		const matchesFormat =
			filters.format === "all" || tool.tags.outputFormat.includes(filters.format);
		const matchesCostType =
			filters.costType === "all" || tool.tags.costType === filters.costType;

		return matchesQuery && matchesPhase && matchesFormat && matchesCostType;
	});
}

/**
 * Smart Filter with Zero-Results Fallback Strategy.
 * Guarantees that any user prompt always returns relevant suggested tools.
 */
export function smartFilterTools(tools: Tool[], filters: ToolFilterState): FilterToolsResult {
	// 1. Strict Match
	const strictResults = filterTools(tools, filters);
	if (strictResults.length > 0) {
		return { tools: strictResults, isFallback: false };
	}

	// 2. Fallback Step 1: Match by detected tags (Phase/Format/Cost) if query was too strict
	if (filters.phase !== "all" || filters.format !== "all" || filters.costType !== "all") {
		const tagOnlyResults = filterTools(tools, { ...filters, query: "" });
		if (tagOnlyResults.length > 0) {
			return {
				tools: tagOnlyResults,
				isFallback: true,
				fallbackReason: "Exibindo recomendações com base nas categorias identificadas no seu prompt:",
			};
		}
	}

	// 3. Fallback Step 2: Partial keyword match across text fields
	const normalizedQuery = filters.query.trim().toLowerCase();
	if (normalizedQuery.length > 1) {
		const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);
		if (queryWords.length > 0) {
			const partialResults = tools.filter((tool) => {
				const fullText = (tool.name + " " + tool.jobToBeDone + " " + tool.tip).toLowerCase();
				return queryWords.some((word) => fullText.includes(word));
			});

			if (partialResults.length > 0) {
				return {
					tools: partialResults,
					isFallback: true,
					fallbackReason: "Exibindo ferramentas que possuem relação com o seu prompt:",
				};
			}
		}
	}

	// 4. Fallback Step 3: Top Curated Tools (guarantees zero empty screens for unusual prompts)
	return {
		tools: tools.slice(0, 8),
		isFallback: true,
		fallbackReason: "Não encontramos um resultado exato para todos os termos, mas selecionamos as ferramentas mais populares para você:",
	};
}

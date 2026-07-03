import type { CostType, Tool } from "./tools";

export type ToolFilterState = {
	query: string;
	phase: string;
	format: string;
	costType: string;
};

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

import { describe, expect, it } from "vitest";
import type { Tool } from "./tools";
import { filterTools, formatCostType, getUniqueValues } from "./tool-filters";

const tools: Tool[] = [
	{
		id: "gamma",
		name: "Gamma",
		url: "https://gamma.app",
		jobToBeDone: "Ferramenta para criação de slides.",
		tags: {
			lessonPhase: ["Planejamento", "Execução"],
			outputFormat: ["Slides"],
			costType: "Freemium",
			costDetail: "Gratuita com limitações",
		},
		tip: "Boa para apresentar conteúdo visual.",
		screenshotUrl: "/images/tools/gamma.jpg",
	},
	{
		id: "chatpdf",
		name: "ChatPDF",
		url: "https://chatpdf.com",
		jobToBeDone: "Permite pesquisar em documentos longos.",
		tags: {
			lessonPhase: ["Pesquisa", "Planejamento"],
			outputFormat: ["Texto"],
			costType: "Trial",
			costDetail: "Gratuita por 15 dias",
		},
		tip: "Use para leitura guiada de PDFs.",
		screenshotUrl: "/images/tools/chatpdf.jpg",
	},
	{
		id: "oorion",
		name: "OOrion",
		url: "https://oorion.fr",
		jobToBeDone: "Acessibilidade com IA para pessoas com deficiência visual.",
		tags: {
			lessonPhase: ["Execução"],
			outputFormat: ["Acessibilidade"],
			costType: "Free",
			costDetail: "Gratuita",
		},
		tip: "Apoia leitura do ambiente.",
		screenshotUrl: "/images/tools/oorion.jpg",
	},
];

describe("tool filters", () => {
	it("returns unique values sorted", () => {
		expect(getUniqueValues(tools, "lessonPhase")).toEqual([
			"Execução",
			"Pesquisa",
			"Planejamento",
		]);
		expect(getUniqueValues(tools, "outputFormat")).toEqual([
			"Acessibilidade",
			"Slides",
			"Texto",
		]);
	});

	it("filters by query and tags", () => {
		const filtered = filterTools(tools, {
			query: "pdf",
			phase: "Pesquisa",
			format: "Texto",
			costType: "Trial",
		});

		expect(filtered).toHaveLength(1);
		expect(filtered[0]?.id).toBe("chatpdf");
	});

	it("allows all filters to be cleared", () => {
		expect(
			filterTools(tools, {
				query: "",
				phase: "all",
				format: "all",
				costType: "all",
			}),
		).toHaveLength(3);
	});

	it("formats cost labels for display", () => {
		expect(formatCostType("Free")).toBe("Gratuita");
		expect(formatCostType("Freemium")).toBe("Freemium");
		expect(formatCostType("Trial")).toBe("Teste grátis");
	});
});

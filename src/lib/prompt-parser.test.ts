import { describe, expect, it } from "vitest";
import { parsePrompt } from "./prompt-parser";

const phases = ["Planejamento", "Execução", "Pesquisa", "Avaliação"];
const formats = ["Slides", "Texto", "Imagem", "Vídeo"];

describe("prompt parser", () => {
	it("parses cost, format, and phase from natural language prompt", () => {
		const result = parsePrompt(
			"Quero uma ferramenta gratuita para criar slides para o planejamento",
			phases,
			formats,
		);

		expect(result.costType).toBe("Free");
		expect(result.format).toBe("Slides");
		expect(result.phase).toBe("Planejamento");
		expect(result.detectedChips.map((c) => c.type)).toEqual(["cost", "format", "phase"]);
	});

	it("handles empty or blank prompt gracefully", () => {
		const result = parsePrompt("", phases, formats);

		expect(result.costType).toBe("all");
		expect(result.format).toBe("all");
		expect(result.phase).toBe("all");
		expect(result.query).toBe("");
		expect(result.detectedChips).toHaveLength(0);
	});

	it("extracts residual query keywords when available", () => {
		const result = parsePrompt(
			"Quero uma ferramenta freemium de matematica para a fase de pesquisa",
			phases,
			formats,
		);

		expect(result.costType).toBe("Freemium");
		expect(result.phase).toBe("Pesquisa");
		expect(result.query).toContain("matematica");
	});
});

import type { CostType } from "./tools";

export interface ParsedPromptResult {
	phase: string;
	format: string;
	costType: string;
	query: string;
	detectedChips: Array<{
		type: "phase" | "format" | "cost" | "query";
		label: string;
		rawValue: string;
	}>;
}

// Synonyms map for Cost Types
const COST_SYNONYMS: Record<string, CostType> = {
	gratis: "Free",
	gratuita: "Free",
	gratuito: "Free",
	"100% gratis": "Free",
	"sem custo": "Free",
	freemium: "Freemium",
	"plano gratis": "Freemium",
	"gratis com limitacoes": "Freemium",
	trial: "Trial",
	"teste gratis": "Trial",
	"teste gratuito": "Trial",
	paga: "Paid",
	pago: "Paid",
	assinatura: "Paid",
};

function normalizeText(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim();
}

export function parsePrompt(
	rawPrompt: string,
	availablePhases: string[],
	availableFormats: string[],
): ParsedPromptResult {
	if (!rawPrompt || rawPrompt.trim().length === 0) {
		return {
			phase: "all",
			format: "all",
			costType: "all",
			query: "",
			detectedChips: [],
		};
	}

	const normalizedPrompt = normalizeText(rawPrompt);
	let detectedPhase = "all";
	let detectedFormat = "all";
	let detectedCostType = "all";
	const detectedChips: ParsedPromptResult["detectedChips"] = [];

	// 1. Detect Cost
	for (const [key, value] of Object.entries(COST_SYNONYMS)) {
		if (normalizedPrompt.includes(key)) {
			detectedCostType = value;
			const labelCost =
				value === "Free"
					? "Gratuita"
					: value === "Freemium"
					? "Freemium"
					: value === "Trial"
					? "Teste Grátis"
					: "Paga";
			detectedChips.push({
				type: "cost",
				label: `Custo: ${labelCost}`,
				rawValue: value,
			});
			break;
		}
	}

	// 2. Detect Format
	for (const fmt of availableFormats) {
		const normFmt = normalizeText(fmt);
		const isMatch =
			normalizedPrompt.includes(normFmt) ||
			(normFmt === "imagem" && (normalizedPrompt.includes("imagens") || normalizedPrompt.includes("foto") || normalizedPrompt.includes("fotos"))) ||
			(normFmt === "slides" && (normalizedPrompt.includes("slide") || normalizedPrompt.includes("apresentacao") || normalizedPrompt.includes("apresentacoes"))) ||
			(normFmt === "texto" && (normalizedPrompt.includes("redacao") || normalizedPrompt.includes("artigo") || normalizedPrompt.includes("textos") || normalizedPrompt.includes("resumo"))) ||
			(normFmt === "video" && (normalizedPrompt.includes("videos") || normalizedPrompt.includes("filme") || normalizedPrompt.includes("filmes"))) ||
			(normFmt === "audio" && (normalizedPrompt.includes("audios") || normalizedPrompt.includes("voz") || normalizedPrompt.includes("som") || normalizedPrompt.includes("podcast") || normalizedPrompt.includes("podcasts"))) ||
			(normFmt === "quizzes" && (normalizedPrompt.includes("quiz") || normalizedPrompt.includes("teste") || normalizedPrompt.includes("testes") || normalizedPrompt.includes("prova") || normalizedPrompt.includes("provas") || normalizedPrompt.includes("gamificada") || normalizedPrompt.includes("gameficada") || normalizedPrompt.includes("jogo") || normalizedPrompt.includes("jogos")));

		if (isMatch) {
			detectedFormat = fmt;
			detectedChips.push({
				type: "format",
				label: `Formato: ${fmt}`,
				rawValue: fmt,
			});
			break;
		}
	}

	// 3. Detect Phase
	for (const phase of availablePhases) {
		const normPhase = normalizeText(phase);
		const isMatch =
			normalizedPrompt.includes(normPhase) ||
			(normPhase === "planejamento" && (normalizedPrompt.includes("plano de aula") || normalizedPrompt.includes("preparar") || normalizedPrompt.includes("preparacao") || normalizedPrompt.includes("elaborar") || normalizedPrompt.includes("roteiro"))) ||
			(normPhase === "avaliacao" && (normalizedPrompt.includes("prova") || normalizedPrompt.includes("provas") || normalizedPrompt.includes("testes") || normalizedPrompt.includes("nota") || normalizedPrompt.includes("quizzes"))) ||
			(normPhase === "pesquisa" && (normalizedPrompt.includes("pesquisar") || normalizedPrompt.includes("buscar fonte") || normalizedPrompt.includes("fontes") || normalizedPrompt.includes("estudo") || normalizedPrompt.includes("investigacao"))) ||
			(normPhase === "execucao" && (normalizedPrompt.includes("sala de aula") || normalizedPrompt.includes("apresentar") || normalizedPrompt.includes("explicar") || normalizedPrompt.includes("engajar") || normalizedPrompt.includes("turma")));

		if (isMatch) {
			detectedPhase = phase;
			detectedChips.push({
				type: "phase",
				label: `Fase: ${phase}`,
				rawValue: phase,
			});
			break;
		}
	}

	// 4. Extract Query Keywords (remove matched intent phrases and noise words)
	let residualText = normalizedPrompt;

	const fillers = [
		"quero uma ferramenta",
		"quero um site",
		"quero uma ia",
		"preciso de",
		"me ajude a",
		"me indique",
		"qual a melhor",
		"quais sao as",
		"ferramentas para",
		"ferramenta para",
		"ferramentas",
		"ferramenta",
		"para a aula",
		"para aula",
		"para o",
		"para a",
		"para os",
		"para as",
		"para",
		"com custo",
		"de forma",
		"que seja",
		"gratuita",
		"gratuito",
		"gratis",
		"paga",
		"freemium",
		"criar",
		"gerar",
		"fazer",
		"elaborar",
		"buscar",
		"pesquisar",
		"engajar",
		"quero",
		"preciso",
		"gostaria",
		"ajuda",
		"recursos",
		"aula",
		"aulas",
		"fase",
		"fases",
		"turma",
		"alunos",
		"aluno",
		"minha",
		"meu",
		"meus",
		"minhas",
		"de",
		"em",
		"no",
		"na",
		"nos",
		"nas",
		"uma",
		"um",
		"uns",
		"umas",
		"a",
		"o",
		"os",
		"as",
		"e",
		"ou",
	];

	for (const filler of fillers) {
		residualText = residualText.replace(new RegExp(`\\b${filler}\\b`, "gi"), " ");
	}

	if (detectedFormat !== "all") {
		residualText = residualText.replace(new RegExp(normalizeText(detectedFormat), "gi"), " ");
	}
	if (detectedPhase !== "all") {
		residualText = residualText.replace(new RegExp(normalizeText(detectedPhase), "gi"), " ");
	}

	const cleanedQuery = residualText.replace(/\s+/g, " ").trim();

	if (cleanedQuery.length > 1) {
		detectedChips.push({
			type: "query",
			label: `Busca: "${cleanedQuery}"`,
			rawValue: cleanedQuery,
		});
	}

	return {
		phase: detectedPhase,
		format: detectedFormat,
		costType: detectedCostType,
		query: cleanedQuery,
		detectedChips,
	};
}

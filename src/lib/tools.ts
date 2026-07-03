import { readFile } from "node:fs/promises";

export type CostType = "Free" | "Freemium" | "Paid" | "Trial";

export interface Tool {
	id: string;
	name: string;
	url: string;
	jobToBeDone: string;
	tags: {
		lessonPhase: string[];
		outputFormat: string[];
		costType: CostType;
		costDetail: string;
	};
	tip: string;
	screenshotUrl: string;
}

const toolsFileUrl = new URL("../../data/tools.json", import.meta.url);

export async function getTools(): Promise<Tool[]> {
	const rawTools = await readFile(toolsFileUrl, "utf8");
	return JSON.parse(rawTools) as Tool[];
}

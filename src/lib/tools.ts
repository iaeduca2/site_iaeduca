import { readFile } from "node:fs/promises";
import { join } from "node:path";

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

const toolsFilePath = join(process.cwd(), "data", "tools.json");

export async function getTools(): Promise<Tool[]> {
	const rawTools = await readFile(toolsFilePath, "utf8");
	return JSON.parse(rawTools) as Tool[];
}

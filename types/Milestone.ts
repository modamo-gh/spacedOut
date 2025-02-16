import { TimeUnit } from "./TimeUnit";

export type Milestone = {
	date: string;
	delta: { number: number; unit: TimeUnit};
};

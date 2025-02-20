import { Event } from "./Event";

export type EventsSectionProps = {
	isLoadingSectionEvents: boolean;
	sectionEvents: Event[] | undefined;
	sectionName: string;
};

import { Event } from "./Event";

export type EventContextType = {
	savedEvents: Event[];
	addEvent: (event: Event) => void;
	removeEvent: (id: string) => void;
};

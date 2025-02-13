import { Attraction } from "./Attraction";
import { Event } from "./Event";

export type AttractionEventContextType = {
	addEvent: (event: Event) => void;
	attractions: Attraction[];
	events: Event[];
	getAttractions: (searchTerm: string) => Promise<void>;
	getEvents: (id: string) => Promise<Event[]>;
	savedEvents: Event[];
	removeEvent: (id: string) => void;
};

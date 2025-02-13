import { Attraction } from "./Attraction";
import { Event } from "./Event";

export type AttractionEventContextType = {
	addEvent: (event: Event) => void;
	attractions: Attraction[];
	getAttractions: (searchTerm: string) => Promise<void>;
	getEvents: (id: string) => Promise<Event[]>;
	savedEvents: Event[];
	removeEvent: (id: string) => void;
};

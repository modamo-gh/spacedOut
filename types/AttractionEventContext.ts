import { Dispatch, SetStateAction } from "react";
import { Attraction } from "./Attraction";
import { Event } from "./Event";

export type AttractionEventContextType = {
	addEvent: (event: Event) => void;
	attractions: Attraction[];
	getAttractions: (searchTerm: string) => Promise<void>;
	getEvents: (id: string) => Promise<Event[]>;
	handleMilestoneTriggered: (id: string) => void;
	removeEvent: (id: string) => void;
	savedEvents: Event[];
	savedEventsHash: string | null;
	setAttractions: Dispatch<SetStateAction<Attraction[]>>;
};

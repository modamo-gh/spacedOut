import { Event } from "@/types/Event";
import { EventContextType } from "@/types/EventContext";
import React, { createContext, useContext, useState } from "react";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [savedEvents, setSavedEvents] = useState<Event[]>([]);

	const addEvent = (event: Event) => {
		setSavedEvents((prev) => [...prev, event]);
	};

	const removeEvent = (id: string) => {
		setSavedEvents((prev) => prev.filter((event) => event.id !== id));
	};

	return (
		<EventContext.Provider value={{ addEvent, removeEvent, savedEvents }}>
			{children}
		</EventContext.Provider>
	);
};

export const useEventContext = () => {
	const context = useContext(EventContext);

	return context;
};

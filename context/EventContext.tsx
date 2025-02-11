import { Event } from "@/types/Event";
import { EventContextType } from "@/types/EventContext";
import { DateTime } from "luxon";
import React, { createContext, useContext, useState } from "react";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const generateMilestones = (eventDate: string): string[] => {
	const today = DateTime.now();
	const concertDate = DateTime.fromISO(eventDate);
	const milestoneDates = [concertDate.toLocaleString(DateTime.DATE_FULL)];

	const generateDates = (timeUnit: string, maxOfUnit: number) => {
		const timeObject: { [key: string]: number } = {};

		timeObject[timeUnit] = 1;

		while (
			concertDate.minus(timeObject) >= today &&
			timeObject[timeUnit] < maxOfUnit
		) {
			milestoneDates.push(concertDate.minus(timeObject).toISO());

			timeObject[timeUnit] *= 2;
		}
	};

	generateDates("days", 7);
	generateDates("weeks", 4);
	generateDates("months", 12);
	generateDates("years", Infinity);

	return milestoneDates.reverse();
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [savedEvents, setSavedEvents] = useState<Event[]>([]);

	const addEvent = (event: Event) => {
		setSavedEvents((prev) =>
			[
				...prev,
				{ ...event, milestones: generateMilestones(event.dateTime) }
			].sort(
				(a, b) =>
					DateTime.fromISO(a.milestones[0]).toMillis() -
					DateTime.fromISO(b.milestones[0]).toMillis()
			)
		);
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

	if (!context) {
		throw new Error("useEventContext must be used within an EventProvider");
	}
	return context;
};

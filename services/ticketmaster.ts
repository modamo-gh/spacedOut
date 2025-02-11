import { Attraction } from "@/types/Attraction";
import { Event } from "@/types/Event";
import { DateTime } from "luxon";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

export const getSuggestions = async (artistName: string) => {
	try {
		const response = await fetch(
			`${BASE_URL}/suggest.json?apikey=${
				process.env.EXPO_PUBLIC_API_KEY
			}&keyword=${encodeURIComponent(artistName)}`
		);
		const data = await response.json();
		const suggestions: (Attraction | Event)[] = [];

		for (const suggestion of data._embedded.attractions) {
			suggestions.push({
				id: suggestion.id,
				imageURL: suggestion.images?.[0]?.url,
				name: suggestion.name,
				type: suggestion.type
			});
		}

		for (const suggestion of data._embedded.events) {
			suggestions.push({
				dateTime: DateTime.fromISO(
					suggestion.dates.start.dateTime
				).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
				id: suggestion.id,
				imageURL: suggestion.images?.[0]?.url,
				location: `${suggestion._embedded?.venues?.[0].city?.name}, ${
					suggestion._embedded?.venues?.[0].state?.stateCode ||
					suggestion._embedded?.venues?.[0].country?.countryCode
				}`,
				name: suggestion.name,
				type: suggestion.type
			});
		}

		return suggestions;
	} catch (error) {
		console.error("Error fetching artist:", error);
	}
};

export const getEvents = async (id: string) => {
	try {
		let allEvents = [];
		let page = 0;
		let totalPages = 1;

		while (page < totalPages) {
			const response = await fetch(
				`${BASE_URL}/events.json?apikey=${
					process.env.EXPO_PUBLIC_API_KEY
				}&attractionId=${encodeURIComponent(id)}&page=${page}`
			);
			const data = await response.json();

			if (data._embedded.events) {
				allEvents.push(...data._embedded.events);
			}

			totalPages = data.page.totalPages || 1;
			page++;
		}

		return allEvents;
	} catch (error) {
		console.error("Error fetching events:", error);

		return [];
	}
};

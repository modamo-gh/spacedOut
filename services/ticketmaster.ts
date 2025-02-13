import { Attraction } from "@/types/Attraction";
import { Event } from "@/types/Event";
import { DateTime } from "luxon";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

export const fetchAttractions = async (artistName: string) => {
	try {
		const response = await fetch(
			`${BASE_URL}/attractions.json?apikey=${
				process.env.EXPO_PUBLIC_API_KEY
			}&keyword=${encodeURIComponent(artistName)}`
		);
		const data = await response.json();
		const attractions: Attraction[] = [];

		for (const attraction of data._embedded.attractions) {
			attractions.push({
				id: attraction.id,
				imageURL: [...attraction.images]?.sort(
					(a, b) => b.width - a.width
				)[0]?.url,
				name: attraction.name,
				type: attraction.type
			});
		}

		return attractions;
	} catch (error) {
		console.error("Error fetching attractions:", error);
	}
};

export const fetchEvents = async (id: string) => {
	try {
		let allEvents: Event[] = [];
		let page = 0;
		let totalPages = 1;

		while (page < totalPages) {
			const response = await fetch(
				`${BASE_URL}/events.json?apikey=${
					process.env.EXPO_PUBLIC_API_KEY
				}&attractionId=${encodeURIComponent(id)}&page=${page}`
			);
			const data = await response.json();

			for (const event of data._embedded?.events) {
				allEvents.push({
					dateTime: event.dates.start.dateTime,
					id: event.id,
					imageURL: [...event.images]?.sort(
						(a, b) => b.width - a.width
					)[0]?.url,
					isSaved: false,
					latitude: Number(
						event._embedded?.venues?.[0].location.latitude
					),
					location: `${event._embedded?.venues?.[0].city?.name}, ${
						event._embedded?.venues?.[0].state?.stateCode ||
						event._embedded?.venues?.[0].country?.countryCode
					}`,
					longitude: Number(
						event._embedded?.venues?.[0].location.longitude
					),
					milestones: [],
					name: event.name,
					type: event.type
				});

				console.log(
					[...event.images]?.sort((a, b) => b.width - a.width)[0]?.url
				);
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

export const fetchEventDetails = async (id: string) => {
	try {
		const response = await fetch(
			`${BASE_URL}/events/${id}?apikey=${process.env.EXPO_PUBLIC_API_KEY}`
		);
		const data = await response.json();

		return {
			dateTime: data.dates.start.dateTime,
			id: data.id,
			imageURL: [...data.images]?.sort((a, b) => b.width - a.width)[0]
				?.url,
			isSaved: false,
			latitude: Number(data._embedded?.venues?.[0].location.latitude),
			location: `${data._embedded?.venues?.[0].city?.name}, ${
				data._embedded?.venues?.[0].state?.stateCode ||
				data._embedded?.venues?.[0].country?.countryCode
			}`,
			longitude: Number(data._embedded?.venues?.[0].location.longitude),
			milestones: [],
			name: data.name,
			type: data.type
		};
	} catch (error) {
		console.error("Error fetching events:", error);

		return null;
	}
};

import { API_KEY } from "@env";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

export const findArtist = async (artistName: string) => {
	try {
		const response = await fetch(
			`${BASE_URL}/suggest.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
				artistName
			)}`
		);
		const data = await response.json();

		return data._embedded;
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
				`${BASE_URL}/events.json?apikey=${API_KEY}&attractionId=${encodeURIComponent(
					id
				)}&page=${page}`
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

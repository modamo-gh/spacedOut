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
		const response = await fetch(
			`${BASE_URL}/events.json?apikey=${API_KEY}&attractionId=${encodeURIComponent(
				id
			)}`
		);
		const data = await response.json();

		return data._embedded;
	} catch (error) {
		console.error("Error fetching events:", error);
	}
};
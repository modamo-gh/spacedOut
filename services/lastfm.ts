import { Event } from "@/types/Event";
import { fetchAttractions, fetchEvents, sortEvents } from "./ticketmaster";
import { Attraction } from "@/types/Attraction";

export const getRecommendedEvent = async (
	savedEvents: Event[],
	userLocation: { latitude: number; longitude: number } | null
) => {
	const attractions = new Set<string>(
		savedEvents.flatMap((event) => event.attractions)
	);

	const similarityDictionary = new Map<
		string,
		{ musicbrainz: string | null; scores: number[] }
	>();

	for (const attraction of attractions) {
		try {
			const response = await fetch(
				`https://api.spacedout.modamo.xyz/similarArtists?artist=${encodeURIComponent(
					attraction
				)}`
			);
			const data = await response.json();

			await Promise.all(
				data.artist.map(async (artist) => {
					if (!attractions.has(artist.name)) {
						const entry = similarityDictionary.get(artist.name) || {
							musicbrainz: null,
							scores: <number[]>[]
						};

						const score = Number(artist.match);

						if (!isNaN(score)) {
							entry.scores.push(score);
						}

						try {
							const artistInfoResponse = await fetch(
								`https://api.spacedout.modamo.xyz/artistInfo?artist=${encodeURIComponent(
									artist.name
								)}`
							);
							const artistData = await artistInfoResponse.json();

							entry.musicbrainz = artistData?.mbid || null;
						} catch (error) {
							console.warn(
								`Failed to fetch MusicBrainz ID for ${artist.name}:`,
								error
							);
						}

						similarityDictionary.set(artist.name, entry);
					}
				}) || []
			);
		} catch (error) {
			console.error(
				`Error fetching similar artists for ${attraction}:`,
				error
			);
		}
	}

	const sortedAttractions = [...similarityDictionary.entries()]
		.sort((a, b) => {
			const [, { scores: scoresA }] = a;
			const [, { scores: scoresB }] = b;

			if (scoresB.length !== scoresA.length) {
				return scoresB.length - scoresA.length;
			}

			return Math.max(...scoresB) - Math.max(...scoresA);
		})
		.map(([name, { musicbrainz }]) => ({
			name,
			musicbrainz: musicbrainz || null
		}));

	const viableSearches = new Map<string, Attraction>();

	await Promise.all(
		sortedAttractions.map(async (attraction) => {
			try {
				const fetchedAttractions = await fetchAttractions(
					attraction.name
				);

				if (fetchedAttractions && fetchedAttractions.length) {
					for (const fetchedAttraction of fetchedAttractions) {
						if (
							fetchedAttraction.musicbrainz &&
							attraction.musicbrainz &&
							fetchedAttraction.musicbrainz ===
								attraction.musicbrainz
						) {
							viableSearches.set(
								attraction.name,
								fetchedAttraction
							);
							break;
						} else if (
							!fetchedAttraction.musicbrainz &&
							fetchedAttraction.name.toLowerCase() ===
								attraction.name.toLowerCase()
						) {
							viableSearches.set(
								attraction.name,
								fetchedAttraction
							);
							break;
						}
					}
				}
			} catch (error) {
				console.error(
					`Error fetching attractions for ${attraction}:`,
					error
				);
			}
		})
	);
	console.log(sortedAttractions.length);
	console.log(viableSearches.size);

	for (const attraction of sortedAttractions) {
		const mostLikelyAttraction = viableSearches.get(attraction.name);

		if (mostLikelyAttraction) {
			const events = await fetchEvents(mostLikelyAttraction.id);

			if (events && events.length) {
				const sortedEvents = sortEvents(events, userLocation);

				return sortedEvents[0];
			}
		}
	}

	return null;
};

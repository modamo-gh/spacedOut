import AttractionCard from "@/components/AttractionCard";
import EventsSection from "@/components/EventsSection";
import SearchBar from "@/components/SearchBar";
import StarryBackground from "@/components/StarryBackground";
import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { fetchNearbyEvents, fetchWeeksEvents } from "@/services/ticketmaster";
import { Event } from "@/types/Event";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View
} from "react-native";
import { useUserLocation } from "../hooks/useUserLocation";

const FindEventsScreen = () => {
	const [text, setText] = useState("");
	const [nearbyEvents, setNearbyEvents] = useState<Event[] | undefined>(
		undefined
	);
	const [weeksEvents, setWeeksEvents] = useState<Event[] | undefined>(
		undefined
	);
	const [isLoadingNearbyEvents, setIsLoadingNearbyEvents] = useState(false);
	const [isLoadingEventsThisWeek, setIsLoadingEventsThisWeek] =
		useState(false);
	const [recommendedEvent, setRecommendedEvent] = useState<
		Event[] | undefined
	>(undefined);
	const [isLoadingRecommendation, setIsLoadingRecommendation] =
		useState(false);

	const {
		attractions,
		getAttractions,
		savedEvents,
		savedEventsHash,
		setAttractions
	} = useAttractionEventContext();

	const location = useUserLocation();

	const RECOMMENDED_EVENT_KEY = "recommendedEvent";

	useEffect(() => {
		const getWeeksEvents = async () => {
			setIsLoadingEventsThisWeek(true);

			try {
				const wes = await fetchWeeksEvents();
				setWeeksEvents(wes);
			} finally {
				setIsLoadingEventsThisWeek(false);
			}
		};

		const loadSavedRecommendation = async () => {
			const storedRecommendation = await AsyncStorage.getItem(
				RECOMMENDED_EVENT_KEY
			);

			if (storedRecommendation) {
				setRecommendedEvent(JSON.parse(storedRecommendation));
			}
		};

		getWeeksEvents();
		loadSavedRecommendation();
	}, []);

	useEffect(() => {
		const getNearbyEvents = async () => {
			if (location) {
				setIsLoadingNearbyEvents(true);

				try {
					const nes = await fetchNearbyEvents(
						location.latitude,
						location.longitude
					);
					setNearbyEvents(nes);
				} finally {
					setIsLoadingNearbyEvents(false);
				}
			}
		};

		getNearbyEvents();
	}, [location]);

	// useEffect(() => {
	// 	if (!savedEventsHash || !savedEvents || !savedEvents.length) {
	// 		return;
	// 	}

	// 	const getFeaturedRecommendation = async () => {
	// 		setIsLoadingRecommendation(true);

	// 		try {
	// 			const recommendation = await getRecommendedEvent(
	// 				savedEvents,
	// 				location
	// 			);

	// 			if (recommendation) {
	// 				setRecommendedEvent(recommendation);

	// 				await AsyncStorage.setItem(
	// 					RECOMMENDED_EVENT_KEY,
	// 					JSON.stringify(recommendation)
	// 				);
	// 			}
	// 		} finally {
	// 			setIsLoadingRecommendation(false);
	// 		}
	// 	};

	// 	getFeaturedRecommendation();
	// }, [savedEventsHash]);

	return (
		<View style={styles.container}>
			<StarryBackground />
			<SafeAreaView style={[styles.container, styles.contentContainer]}>
				<Text style={[styles.text, styles.appName]}>SPACEDOUT</Text>
				<SearchBar
					getAttractions={getAttractions}
					setAttractions={setAttractions}
					setText={setText}
					text={text}
				/>
				{text.length ? (
					<View style={[styles.container, styles.listContainer]}>
						<FlashList
							data={attractions}
							estimatedItemSize={20}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<AttractionCard attraction={item} />
							)}
						/>
					</View>
				) : (
					<ScrollView
						style={[{ flex: 1 }, styles.suggestionsContainer]}
					>
						<EventsSection
							isLoadingSectionEvents={isLoadingRecommendation}
							sectionEvents={recommendedEvent}
							sectionName="Recommended Event"
						/>
						<EventsSection
							isLoadingSectionEvents={isLoadingNearbyEvents}
							sectionEvents={nearbyEvents}
							sectionName="Local Events"
						/>
						<EventsSection
							isLoadingSectionEvents={isLoadingEventsThisWeek}
							sectionEvents={weeksEvents}
							sectionName="Upcoming Events"
						/>
					</ScrollView>
				)}
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	appName: {
		fontFamily: "Orbitron",
		fontSize: fontSizes.title,
		fontWeight: "700",
		letterSpacing: 4,
		marginHorizontal: 20,
		marginBottom: 12
	},
	container: { flex: 1 },
	contentContainer: { marginBottom: 16 },
	listContainer: { marginHorizontal: 20 },
	suggestionsContainer: {
		gap: 48,
		marginHorizontal: 20
	},
	text: { color: colors.textPrimary }
});

export default FindEventsScreen;

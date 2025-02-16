import AttractionCard from "@/components/AttractionCard";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import StarryBackground from "@/components/StarryBackground";
import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { fetchNearbyEvents, fetchWeeksEvents } from "@/services/ticketmaster";
import { Event } from "@/types/Event";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	SafeAreaView,
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

	const { attractions, getAttractions, setAttractions } =
		useAttractionEventContext();

	const location = useUserLocation();

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

		const getWeeksEvents = async () => {
			setIsLoadingEventsThisWeek(true);

			try {
				const wes = await fetchWeeksEvents();
				setWeeksEvents(wes);
			} finally {
				setIsLoadingEventsThisWeek(false);
			}
		};

		getNearbyEvents();
		getWeeksEvents();
	}, [location]);

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
					<View
						style={[styles.container, styles.suggestionsContainer]}
					>
						<Text style={[styles.text, styles.sectionHeader]}>
							NEAR YOU
						</Text>
						<View
							style={[styles.container, styles.sectionContainer]}
						>
							{isLoadingNearbyEvents ? (
								<ActivityIndicator
									size="large"
									color={colors.textPrimary}
								/>
							) : nearbyEvents?.length ? (
								<FlashList
									data={nearbyEvents}
									estimatedItemSize={20}
									horizontal
									keyExtractor={({ id }) => id}
									renderItem={({ item }) => (
										<EventCard
											event={item}
											isFeatured={false}
											horizontalScroll
										/>
									)}
								/>
							) : (
								<Text style={styles.noEventsText}>
									No Nearby Events
								</Text>
							)}
						</View>
						<Text style={[styles.text, styles.sectionHeader]}>
							NEXT SEVEN DAYS
						</Text>
						<View
							style={[styles.container, styles.sectionContainer]}
						>
							{isLoadingEventsThisWeek ? (
								<ActivityIndicator
									size="large"
									color={colors.textPrimary}
								/>
							) : weeksEvents?.length ? (
								<FlashList
									data={weeksEvents}
									estimatedItemSize={20}
									horizontal
									keyExtractor={({ id }) => id}
									renderItem={({ item }) => (
										<EventCard
											event={item}
											isFeatured={false}
											horizontalScroll
										/>
									)}
								/>
							) : (
								<Text style={styles.noEventsText}>
									No Events in the next Seven Days
								</Text>
							)}
						</View>
					</View>
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
		gap: 16,
		marginHorizontal: 20
	},
	noEventsText: {
		fontFamily: "Geist",
		fontSize: fontSizes.default
	},
	sectionContainer: { alignItems: "center", justifyContent: "center" },
	sectionHeader: {
		fontFamily: "Geist",
		fontSize: fontSizes.large,
		fontWeight: "semibold"
	},
	text: { color: colors.textPrimary }
});

export default FindEventsScreen;

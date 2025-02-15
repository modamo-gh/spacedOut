import AttractionCard from "@/components/AttractionCard";
import SearchBar from "@/components/SearchBar";
import StarryBackground from "@/components/StarryBackground";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View
} from "react-native";
import { useUserLocation } from "../hooks/useUserLocation";
import { fetchNearbyEvents, fetchWeeksEvents } from "@/services/ticketmaster";
import { Event } from "@/types/Event";
import EventCard from "@/components/EventCard";
import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";

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
			<SafeAreaView style={styles.contentContainer}>
				<Text style={styles.appName}>SPACEDOUT</Text>
				<SearchBar
					getAttractions={getAttractions}
					setAttractions={setAttractions}
					setText={setText}
					text={text}
				/>
				{text.length ? (
					<View style={styles.listContainer}>
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
						style={{
							display: "flex",
							flex: 1,
							gap: 16,
							marginHorizontal: 20
						}}
					>
						<Text
							style={{
								fontFamily: "Geist",
								fontSize: fontSizes.large,
								fontWeight: "semibold",
								color: colors.textPrimary
							}}
						>
							NEAR YOU
						</Text>
						<View
							style={{
								alignItems: "center",
								flex: 1,
								justifyContent: "center"
							}}
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
								<Text
									style={{
										color: colors.textPrimary,
										fontSize: fontSizes.default
									}}
								>
									No Nearby Events
								</Text>
							)}
						</View>
						<Text
							style={{
								fontFamily: "Geist",
								fontSize: fontSizes.large,
								fontWeight: "semibold",
								color: colors.textPrimary
							}}
						>
							NEXT SEVEN DAYS
						</Text>
						<View
							style={{
								alignItems: "center",
								flex: 1,
								justifyContent: "center"
							}}
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
								<Text
									style={{
										color: colors.textPrimary,
										fontSize: fontSizes.default
									}}
								>
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
		color: colors.textPrimary,
		fontFamily: "Orbitron",
		fontSize: fontSizes.title,
		fontWeight: "700",
		letterSpacing: 4,
		marginHorizontal: 20,
		marginBottom: 12
	},
	container: { flex: 1 },
	contentContainer: {
		backgroundColor: "transparent",
		display: "flex",
		flex: 1,
		flexDirection: "column",
		fontFamily: "",
		marginBottom: 16
	},
	listContainer: {
		flex: 1,
		marginHorizontal: 20
	}
});

export default FindEventsScreen;

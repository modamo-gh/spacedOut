import AttractionCard from "@/components/AttractionCard";
import SearchBar from "@/components/SearchBar";
import StarryBackground from "@/components/StarryBackground";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useUserLocation } from "../hooks/useUserLocation";
import { fetchNearbyEvents, fetchWeeksEvents } from "@/services/ticketmaster";
import { Event } from "@/types/Event";
import EventCard from "@/components/EventCard";
import colors from "@/constants/Colors";

const FindEventsScreen = () => {
	const [text, setText] = useState("");
	const [nearbyEvents, setNearbyEvents] = useState<Event[] | undefined>(
		undefined
	);
	const [weeksEvents, setWeeksEvents] = useState<Event[] | undefined>(
		undefined
	);

	const { attractions, getAttractions, setAttractions } =
		useAttractionEventContext();

	const location = useUserLocation();

	useEffect(() => {
		const getNearbyEvents = async () => {
			if (location) {
				const nes = await fetchNearbyEvents(
					location.latitude,
					location.longitude
				);

				setNearbyEvents(nes);
			}
		};

		const getWeeksEvents = async () => {
			const wes = await fetchWeeksEvents();

			setWeeksEvents(wes);
		};

		getNearbyEvents();
		getWeeksEvents();
	}, [location]);

	const [fontsLoaded] = useFonts({
		Geist: require("../../assets/fonts/Geist-VariableFont_wght.ttf"),
		Orbitron: require("../../assets/fonts/Orbitron-VariableFont_wght.ttf")
	});

	if (!fontsLoaded) {
		return null;
	}
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
								fontSize: 20,
								fontWeight: "semibold",
								color: colors.textPrimary
							}}
						>
							NEAR YOU
						</Text>
						<View
							style={{
								flex: 1
							}}
						>
							{nearbyEvents?.length ? (
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
								<Text>No Nearby Events</Text>
							)}
						</View>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "semibold",
								color: colors.textPrimary
							}}
						>
							NEXT SEVEN DAYS
						</Text>
						<View
							style={{
								flex: 1
							}}
						>
							{weeksEvents?.length ? (
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
								<Text>No Events in the next Seven Days</Text>
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
		fontSize: 24,
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
	icon: { color: colors.interactiveIcon, fontSize: 20, marginHorizontal: 16 },
	listContainer: {
		flex: 1,
		marginHorizontal: 20
	},
	searchContainer: {
		alignItems: "center",
		backgroundColor: "#22015E",
		borderColor: "#6600CC",
		borderWidth: 1,
		borderRadius: 10,
		flexDirection: "row",
		height: 48,
		marginBottom: 16,
		marginHorizontal: 20
	},
	textInput: {
		color: "#FFFFFF",
		flex: 1,
		fontFamily: "Geist",
		fontSize: 16,
		height: "100%"
	}
});

export default FindEventsScreen;

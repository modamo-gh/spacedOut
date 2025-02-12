import AttractionCard from "@/components/AttractionCard";
import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import { Attraction } from "@/types/Attraction";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchAttractions, getEvents } from "../../services/ticketmaster";

const FindEventsScreen = () => {
	const [events, setEvents] = useState<any[]>([]);
	const [ids, setIDs] = useState<Set<string>>(new Set());
	const [searchResults, setSearchResults] = useState<(Attraction | Event)[]>(
		[]
	);
	const [text, setText] = useState("");

	const [fontsLoaded] = useFonts({
		Orbitron: require("../../assets/fonts/Orbitron-VariableFont_wght.ttf")
	});

	const getAttractions = async (searchTerm: string) => {
		const searchResults = await fetchAttractions(searchTerm);

		if (!searchResults) {
			return;
		}

		setSearchResults(searchResults);
	};

	const getEventResults = async (id: string) => {
		const e = await getEvents(id);

		setEvents((prev) => {
			const newResults = [];
			const updatedIDs = new Set<string>();

			for (const ev of e) {
				if (!updatedIDs.has(ev.id)) {
					updatedIDs.add(ev.id);
					newResults.push(ev);
				}
			}

			setIDs(new Set(updatedIDs));

			return [...prev, ...newResults];
		});
	};

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={styles.container}>
			<StarryBackground />
			<SafeAreaView style={styles.contentContainer}>
				<Text style={styles.appName}>SPACEDOUT</Text>
				<View style={styles.searchContainer}>
					<Feather
						color="#9287AB"
						name="search"
						style={styles.icon}
					/>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						onChangeText={setText}
						onSubmitEditing={() => {
							setEvents([]);
							getAttractions(text.trim());
						}}
						placeholder="Search for Attraction"
						placeholderTextColor="#9287AB"
						style={styles.textInput}
						value={text}
					/>
					{text.length ? (
						<Feather
							color="#9287AB"
							name="x"
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Medium
								);
								setText("");
								setSearchResults([]);
							}}
							style={styles.icon}
						/>
					) : null}
				</View>
				<View style={styles.container}>
					<FlashList
						data={events.length ? events : searchResults}
						estimatedItemSize={10}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) =>
							item.type === "attraction" ? (
								<AttractionCard
									attraction={item}
									getEventResults={getEventResults}
								/>
							) : (
								<EventCard event={item} />
							)
						}
					/>
				</View>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	appName: {
		color: "white",
		fontFamily: "Orbitron",
		fontSize: 24,
		fontWeight: "700",
		letterSpacing: 4,
		marginHorizontal: 20,
		marginBottom: 12
	},
	container: { flex: 1 },
	contentContainer: {
		display: "flex",
		flex: 1,
		flexDirection: "column"
	},
	icon: { fontSize: 20, marginHorizontal: 16 },
	searchContainer: {
		alignItems: "center",
		backgroundColor: "#22015E",
		borderColor: "#6600CC",
		borderWidth: 1,
		borderRadius: 10,
		flexDirection: "row",
		height: 48,
		marginBottom: 12,
		marginHorizontal: 20
	},
	textInput: {
		color: "#FFFFFF",
		flex: 1,
		fontSize: 16,
		height: "100%"
	}
});

export default FindEventsScreen;

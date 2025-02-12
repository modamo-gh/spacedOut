import AttractionCard from "@/components/AttractionCard";
import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import { Attraction } from "@/types/Attraction";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { getEvents, getSuggestions } from "../../services/ticketmaster";
import Feather from "@expo/vector-icons/Feather";

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

	const getSearchResults = async (searchTerm: string) => {
		const searchResults = await getSuggestions(searchTerm);

		if (!searchResults) {
			return;
		}

		setSearchResults(searchResults);
	};

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={{ flex: 1 }}>
			<StarryBackground />
			<SafeAreaView
				style={{
					display: "flex",
					flex: 1,
					flexDirection: "column"
				}}
			>
				<Text style={styles.text}>SPACEDOUT</Text>
				<View
					style={{
						alignItems: "center",
						backgroundColor: "#22015E",
						borderColor: "#6600CC",
						borderWidth: 1,
						borderRadius: 5,
						flexDirection: "row",
						height: 48,
						marginBottom: 12,
						marginHorizontal: 20
					}}
				>
					<Feather
						color="#9287AB"
						name="search"
						style={{ fontSize: 20, paddingLeft: 16 }}
					/>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						onChangeText={setText}
						onSubmitEditing={() => {
							setEvents([]);
							getSearchResults(text.trim());
						}}
						placeholder="Search for Attraction"
						placeholderTextColor="#9287AB"
						style={styles.textInput}
						value={text}
					/>
				</View>
				<View style={{ flex: 1 }}>
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
	buttonText: {
		flex: 1,
		fontSize: 18,
		textAlign: "center",
		color: "#330099"
	},
	canvas: {
		height: "100%",
		position: "absolute",
		width: "100%"
	},
	dateText: { fontSize: 37 },
	labelText: { fontSize: 18 },
	text: {
		color: "white",
		fontFamily: "Orbitron",
		fontSize: 24,
		fontWeight: "700",
		letterSpacing: 4,
		marginHorizontal: 20,
		marginBottom: 12
	},
	textInput: {
		color: "#FFFFFF",
		flex: 1,
		fontSize: 16,
		height: "100%",
		paddingLeft: 8
	}
});

export default FindEventsScreen;

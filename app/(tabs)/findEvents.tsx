import AttractionCard from "@/components/AttractionCard";
import StarryBackground from "@/components/StarryBackground";
import { Attraction } from "@/types/Attraction";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import SearchBar from "@/components/SearchBar";
import { useAttractionEventContext } from "@/context/AttractionEventContext";

const FindEventsScreen = () => {
	const [searchResults, setSearchResults] = useState<Attraction[]>([]);
	const [text, setText] = useState("");
	
	const {attractions, getAttractions, setAttractions} = useAttractionEventContext();

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
		backgroundColor: "transparent",
		display: "flex",
		flex: 1,
		flexDirection: "column",
		fontFamily: ""
	},
	icon: { color: "#9287AB", fontSize: 20, marginHorizontal: 16 },
	listContainer: { flex: 1, marginHorizontal: 20 },
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

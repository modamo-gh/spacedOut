import { SearchBarProps } from "@/types/SearchBarProps";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const SearchBar: React.FC<SearchBarProps> = ({
	getAttractions,
	setSearchResults,
	setText,
	text
}) => {
	return (
		<View style={styles.searchContainer}>
			<Feather name="search" style={styles.icon} />
			<TextInput
				autoCapitalize="none"
				autoCorrect={false}
				onChangeText={setText}
				onSubmitEditing={() => {
					getAttractions(text.trim());
				}}
				placeholder="Search for Attraction"
				placeholderTextColor="#9287AB"
				style={styles.textInput}
				value={text}
			/>
			{text.length ? (
				<Feather
					name="x"
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
						setText("");
						setSearchResults([]);
					}}
					style={styles.icon}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	icon: { color: "#9287AB", fontSize: 20, marginHorizontal: 16 },
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

export default SearchBar;

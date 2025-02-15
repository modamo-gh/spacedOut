import colors from "@/constants/Colors";
import { SearchBarProps } from "@/types/SearchBarProps";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const SearchBar: React.FC<SearchBarProps> = ({
	getAttractions,
	setAttractions,
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
						setAttractions([]);
					}}
					style={styles.icon}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	icon: { color: colors.interactiveIcon, fontSize: 20, marginHorizontal: 16 },
	searchContainer: {
		alignItems: "center",
		backgroundColor: colors.interactiveBackground,
		borderColor: colors.secondary,
		borderWidth: 1,
		borderRadius: 10,
		flexDirection: "row",
		height: 48,
		marginBottom: 16,
		marginHorizontal: 20
	},
	textInput: {
		color: colors.textPrimary,
		flex: 1,
		fontFamily: "Geist",
		fontSize: 16,
		height: "100%"
	}
});

export default SearchBar;

import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
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
				onPress={() =>
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
				}
				onSubmitEditing={() => {
					getAttractions(text.trim());
				}}
				placeholder="Search for Attraction"
				placeholderTextColor={colors.interactiveIcon}
				style={styles.textInput}
				value={text}
			/>
			{text.length && (
				<Feather
					name="x"
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
						setText("");
						setAttractions([]);
					}}
					style={styles.icon}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	icon: {
		color: colors.interactiveIcon,
		fontSize: fontSizes.default,
		marginHorizontal: 16
	},
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
		fontSize: fontSizes.default,
		height: "100%"
	}
});

export default SearchBar;

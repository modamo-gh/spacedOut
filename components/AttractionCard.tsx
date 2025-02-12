import { AttractionCardProps } from "@/types/AttractionCardProps";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const AttractionCard: React.FC<AttractionCardProps> = ({
	attraction,
	getEventResults
}) => {
	return (
		<Pressable
			onPress={() => getEventResults(attraction.id)}
			style={styles.card}
		>
			<Image source={{ uri: attraction.imageURL }} style={styles.image} />
			<View style={styles.textContainer}>
				<Text style={styles.text}>{attraction.name}</Text>
				<Feather
					color="#9287AB"
					name="chevron-right"
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
					}}
					style={styles.icon}
				/>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		backgroundColor: "#2F0091",
		borderRadius: 8,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 32
	},
	icon: { color: "#FFFFFF", fontSize: 20, marginHorizontal: 16 },
	image: {
		borderRadius: 50,
		height: 72,
		width: 72
	},
	text: {
		color: "#FFFFFF",
		flex: 1,
		flexWrap: "wrap",
		fontFamily: "Geist",
		fontSize: 16
	},
	textContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		paddingLeft: 20
	}
});

export default AttractionCard;

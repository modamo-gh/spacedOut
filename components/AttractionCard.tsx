import { AttractionCardProps } from "@/types/AttractionCardProps";
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
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		backgroundColor: "#6600CC",
		borderRadius: 8,
		display: "flex",
		flexDirection: "row",
		height: 96,
		justifyContent: "space-between",
		margin: 8,
		padding: 8
	},
	image: {
		borderRadius: 8,
		height: 72,
		width: 72
	},
	text: { color: "white", flexWrap: "wrap" },
	textContainer: { flex: 1, paddingLeft: 8 }
});

export default AttractionCard;

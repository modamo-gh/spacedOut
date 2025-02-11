import { AttractionCardProps } from "@/types/AttractionCardProps";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
	return (
		<TouchableOpacity
			// onPress={() => {
			// 	if (!selectedID) {
			// 		setSelectedID(attraction.id);
			// 		getEventResults(attraction.id);
			// 	} else {
			// 		addEvent({
			// 			date: DateTime.fromISO(
			// 				attraction.dates.start.dateTime
			// 			).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
			// 			id: attraction.id,
			// 			image: attraction.images?.[0]?.url,
			// 			location: `${attraction._embedded?.venues?.[0].city?.name}, ${
			// 				attraction._embedded?.venues?.[0].state?.stateCode ||
			// 				attraction._embedded?.venues?.[0].country?.countryCode
			// 			}`,
			// 			name: attraction.name
			// 		});
			// 		setEvents([]);
			// 		setSearchResults([]);
			// 		setSelectedID("");
			// 	}
			// }}
			style={styles.card}
		>
			<Image source={{ uri: attraction.imageURL }} style={styles.image} />
			<Text style={styles.text}>{attraction.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#6600CC",
		borderRadius: 8,
		display: "flex",
		flexDirection: "row",
		height: 96,
		alignItems: "center",
		margin: 8,
		padding: 8
	},
	image: {
		borderRadius: 8,
		height: 72,
		width: 72
	},
	text: { color: "white", paddingLeft: 8, width: "80%" }
});

export default AttractionCard;

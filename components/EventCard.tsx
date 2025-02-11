import { useEventContext } from "@/context/EventContext";
import { EventCardProps } from "@/types/EventCardProps";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { addEvent } = useEventContext();

	return (
		<TouchableOpacity
			onPress={() => addEvent(event)}
			style={styles.card}
		>
			<Image source={{ uri: event.imageURL }} style={styles.image} />
			<View>
				<Text style={styles.text}>{event.name}</Text>
				<Text style={styles.text}>{event.dateTime}</Text>
				<Text style={styles.text}>{event.location}</Text>
			</View>
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
	text: { color: "white", paddingLeft: 8 }
});

export default EventCard;

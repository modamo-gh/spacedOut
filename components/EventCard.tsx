import { useEventContext } from "@/context/EventContext";
import { EventCardProps } from "@/types/EventCardProps";
import { DateTime } from "luxon";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const EventCard: React.FC<EventCardProps> = ({ event }) => {
	const { addEvent } = useEventContext();

	return (
		<Pressable onPress={() => addEvent(event)} style={styles.card}>
			<Image source={{ uri: event.imageURL }} style={styles.image} />
			<View style={styles.textContainer}>
				<Text style={styles.text}>{event.name}</Text>
				<Text style={styles.text}>
					{DateTime.fromISO(event.dateTime).toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY
					)}
				</Text>
				<Text style={styles.text}>{event.location}</Text>
				{event.milestones.length && (
					<Text
						style={styles.text}
					>{`Next Milestone: ${DateTime.fromISO(
						event.milestones[0]
					).toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY
					)}`}</Text>
				)}
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

export default EventCard;

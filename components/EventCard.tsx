import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { EventCardProps } from "@/types/EventCardProps";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const EventCard: React.FC<EventCardProps> = ({ event }) => {
	const router = useRouter();
	const { addEvent } = useAttractionEventContext();
	const [isSaved, setIsSaved] = useState(false);

	return (
		<Pressable
			onPress={() => router.push(`/event/${event.id}`)}
			style={styles.card}
		>
			<Image source={{ uri: event.imageURL }} style={styles.image} />
			<View style={styles.textContainer}>
				<Text numberOfLines={1} style={styles.nameText}>
					{event.name}
				</Text>
				<Text style={styles.dateText}>
					{DateTime.fromISO(event.dateTime).toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY
					)}
				</Text>
				<Text style={styles.locationText}>{event.location}</Text>
			</View>
			<AntDesign
				name={isSaved ? "heart" : "hearto"}
				onPress={() => {
					setIsSaved((prev) => {
						if(!prev){
							addEvent(event);
						}

						return !prev;
					});
				}}
				style={styles.icon}
			/>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		borderRadius: 8,
		display: "flex",
		flexDirection: "row",
		height: 72,
		justifyContent: "space-between",
		marginBottom: 14
	},
	dateText: { color: "#F1F54F", flex: 1 },
	icon: { color: "#FFFFFF", fontSize: 24 },
	image: {
		borderRadius: 8,
		height: 72,
		width: 72
	},
	locationText: { color: "#D5D5D5", flex: 1 },
	nameText: { color: "#FFFFFF", flex: 1, fontSize: 16 },
	textContainer: { display: "flex", flex: 1, height: "100%", paddingLeft: 12 }
});

export default EventCard;

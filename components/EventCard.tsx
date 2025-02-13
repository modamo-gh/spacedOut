import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { EventCardProps } from "@/types/EventCardProps";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const EventCard: React.FC<EventCardProps> = ({ event, isFeatured }) => {
	const router = useRouter();
	const { addEvent, removeEvent, savedEvents } = useAttractionEventContext();

	const isSaved = savedEvents.some(
		(savedEvent) => savedEvent.id === event.id
	);

	return (
		<Pressable
			onPress={() => router.push(`/event/${event.id}`)}
			style={[styles.card, isFeatured && styles.featuredCard]}
		>
			<Image
				cachePolicy="memory-disk"
				source={{ uri: event.imageURL }}
				style={[styles.image, isFeatured && styles.featuredImage]}
			/>
			<View
				style={
					isFeatured
						? styles.featuredTextContainer
						: styles.textContainer
				}
			>
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
				onPress={() =>
					isSaved ? removeEvent(event.id) : addEvent(event)
				}
				style={[styles.icon, isFeatured && styles.featuredIcon]}
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
	featuredCard: {
		display: "flex",
		height: 200,
		alignItems: "flex-end",
		overflow: "hidden",
		position: "relative"
	},
	featuredIcon: { padding: 8, position: "absolute", top: 0, right: 0 },
	featuredImage: {
		height: "100%",
		position: "absolute",
		width: "100%"
	},
	featuredTextContainer: {
		backgroundColor: "rgba(0,0,0,0.5)",
		gap: 4,
		padding: 12,
		position: "absolute",
		width: "100%"
	},
	icon: { color: "#F48FB1", fontSize: 24 },
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

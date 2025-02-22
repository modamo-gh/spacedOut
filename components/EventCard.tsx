import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { EventCardProps } from "@/types/EventCardProps";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import { DateTime } from "luxon";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const EventCard: React.FC<EventCardProps> = ({
	event,
	isFeatured,
	horizontalScroll
}) => {
	const router = useRouter();
	const { addEvent, removeEvent, savedEvents } = useAttractionEventContext();

	const isSaved = savedEvents.some(
		(savedEvent) => savedEvent.id === event.id
	);

	const pathname = usePathname();
	const isMyEvents = pathname === "/myEvents";

	console.log(event.milestones?.[0]);
	return (
		<Pressable
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				router.push(`/event/${event.id}`);
			}}
			style={
				horizontalScroll
					? {
							backgroundColor: colors.secondary,
							borderRadius: 8,
							height: "100%",
							width: 180,
							marginRight: 12,
							alignItems: "center",
							padding: 8
					  }
					: [styles.card, isFeatured && styles.featuredCard]
			}
		>
			<Image
				cachePolicy="memory-disk"
				source={{ uri: event.imageURL }}
				style={
					horizontalScroll
						? {
								borderRadius: 50,
								height: 80,
								width: 80,
								margin: 20
						  }
						: [styles.image, isFeatured && styles.featuredImage]
				}
			/>
			<View
				style={
					horizontalScroll
						? {
								padding: 0,
								display: "flex",
								flexDirection: "column",
								flex: 1
						  }
						: [
								isFeatured
									? styles.featuredTextContainer
									: styles.textContainer
						  ]
				}
			>
				<Text
					numberOfLines={horizontalScroll ? 2 : 1}
					style={
						horizontalScroll
							? {
									textAlign: "center",
									color: colors.textPrimary,
									fontFamily: "Geist",
									fontSize: 16,
									flex: 1
							  }
							: styles.nameText
					}
				>
					{event.name}
				</Text>
				<Text
					style={
						horizontalScroll
							? {
									color: colors.textHighlight,
									fontFamily: "Geist",
									fontSize: fontSizes.small,
									textAlign: "center",
									flex: 1
							  }
							: styles.dateText
					}
				>
					{horizontalScroll
						? DateTime.fromISO(event.dateTime).toLocaleString(
								DateTime.DATE_MED_WITH_WEEKDAY
						  )
						: DateTime.fromISO(event.dateTime).toLocaleString(
								DateTime.DATETIME_MED_WITH_WEEKDAY
						  )}
				</Text>
				{isSaved && isMyEvents && (
					<Text
						style={{
							color: colors.textPrimary,
							fontFamily: "Geist",
							fontSize: fontSizes.small,
							flex: 1
						}}
					>
						{`Next Milestone: ${
							isFeatured
								? DateTime.fromISO(
										event.milestones?.[0]?.date
								  ).toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY
								  )
								: DateTime.fromISO(
										event.milestones?.[0]?.date
								  ).toLocaleString(
										DateTime.DATE_MED_WITH_WEEKDAY
								  )
						}`}
					</Text>
				)}
				<Text
					style={
						horizontalScroll
							? {
									color: colors.textHighlight,
									textAlign: "center",
									fontFamily: "Geist",
									fontSize: fontSizes.small,
									flex: 1
							  }
							: {
									color: colors.textHighlight,
									flex: 1,
									fontFamily: "Geist",
									fontSize: fontSizes.small
							  }
					}
				>
					{event.location}
				</Text>
			</View>
			<AntDesign
				name={isSaved ? "heart" : "hearto"}
				onPress={() => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
					isSaved ? removeEvent(event.id) : addEvent(event);
				}}
				style={
					horizontalScroll
						? {
								position: "absolute",
								top: 0,
								right: 0,
								padding: 8,
								color: colors.accent,
								fontSize: 24
						  }
						: [styles.icon, isFeatured && styles.featuredIcon]
				}
				suppressHighlighting
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
	dateText: {
		color: colors.textHighlight,
		flex: 1,
		fontFamily: "Geist",
		fontSize: fontSizes.small
	},
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
	icon: { color: colors.accent, fontSize: 24 },
	image: {
		borderRadius: 8,
		height: 72,
		width: 72
	},
	locationText: { color: "#D5D5D5", flex: 1 },
	nameText: {
		color: colors.textPrimary,
		flex: 1,
		fontFamily: "Geist",
		fontSize: 16
	},
	textContainer: { display: "flex", flex: 1, height: "100%", paddingLeft: 12 }
});

export default EventCard;

import BackButton from "@/components/BackButton";
import {
	generateMilestones,
	useAttractionEventContext
} from "@/context/AttractionEventContext";
import { fetchEventDetails } from "@/services/ticketmaster";
import { Event } from "@/types/Event";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Linking,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const HEADER_HEIGHT = screenHeight * 0.4;

const EventDetailScreen = () => {
	const { id } = useLocalSearchParams();
	const { addEvent, removeEvent, savedEvents } = useAttractionEventContext();
	const [event, setEvent] = useState<Event | undefined>(undefined);

	const eventID = Array.isArray(id) ? id[0] : id;

	const insets = useSafeAreaInsets();

	useEffect(() => {
		const loadEvent = async () => {
			let foundEvent = savedEvents.find((e) => e.id === eventID);

			if (!foundEvent) {
				try {
					foundEvent = await fetchEventDetails(eventID);
					if (foundEvent) {
						foundEvent = {
							...foundEvent,
							milestones: generateMilestones(foundEvent.dateTime)
						};
					}
				} catch (error) {
					console.error("Error fetching event:", error);
				}
			}

			setEvent(foundEvent);
		};

		if (eventID) {
			loadEvent();
		}
	}, [eventID, savedEvents]);

	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollY.value = e.contentOffset.y;
		}
	});

	const animatedImageStyle = useAnimatedStyle(() => {
		return {
			height: interpolate(
				scrollY.value,
				[0, HEADER_HEIGHT],
				[HEADER_HEIGHT, 0],
				Extrapolation.CLAMP
			)
		};
	});

	if (!event) {
		return <Text>Event Not Found</Text>;
	}

	const isSaved = savedEvents.some(
		(savedEvent) => savedEvent.id === event.id
	);

	const openMaps = () => {
		const { latitude, longitude } = event;
		const url = Platform.select({
			android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
			ios: `maps://app?saddr=&daddr=${latitude},${longitude}`
		});

		if (url) {
			Linking.openURL(url).catch((error) =>
				console.error("Error opening maps:", error)
			);
		}
	};

	return (
		<View style={{ backgroundColor: "#220066", flex: 1 }}>
			<BackButton />
			<AntDesign
				name={isSaved ? "heart" : "hearto"}
				onPress={() =>
					isSaved ? removeEvent(event.id) : addEvent(event)
				}
				style={{
					color: "#F48FB1",
					fontSize: 48,
					position: "absolute",
					right: 16,
					top: insets.top - 8,
					zIndex: 1
				}}
			/>
			<Animated.View style={[styles.image, animatedImageStyle]}>
				<Image
					cachePolicy="memory-disk"
					source={{ uri: event?.imageURL }}
					style={{ width: "100%", height: "100%" }}
				/>
			</Animated.View>
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				style={{ flex: 1 }}
			>
				<View style={{ height: HEADER_HEIGHT }} />
				<View style={{ gap: 8, padding: 16 }}>
					<Text style={styles.name}>{event.name}</Text>
					<Text
						style={[
							styles.text,
							{ color: "#F1F54F", marginBottom: 8 }
						]}
					>
						{DateTime.fromISO(event.dateTime).toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY
						)}
					</Text>
					<Pressable onPress={openMaps}>
						<Image
							cachePolicy="memory-disk"
							source={{
								uri: `https://api.spacedout.modamo.xyz/venue?latitude=${event.latitude}&longitude=${event.longitude}`
							}}
							style={{
								width: "100%",
								height: 200,
								borderRadius: 10
							}}
						/>
					</Pressable>
					<View>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "semibold",
								color: "white",
								marginBottom: 8
							}}
						>
							Next Milestone
						</Text>
						<View
							style={{
								backgroundColor: "#6600CC",
								borderRadius: 10,
								padding: 20,
								marginBottom: 8
							}}
						>
							<Text style={styles.text}>
								{DateTime.fromISO(
									event.milestones[0]
								).toLocaleString(
									DateTime.DATETIME_MED_WITH_WEEKDAY
								)}
							</Text>
						</View>
					</View>
					<View>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "semibold",
								color: "white",
								marginBottom: 8
							}}
						>
							Remaining Milestones
						</Text>
						<View
							style={{
								backgroundColor: "#6600CC",
								borderRadius: 10,
								marginBottom: 8
							}}
						>
							{event.milestones
								.slice(1)
								.map((milestone, index) => (
									<Text
										key={index}
										style={{
											borderBottomColor: "#7459A6",
											borderBottomWidth:
												index <
												event.milestones.length - 2
													? 1
													: 0,
											color: "white",
											fontSize: 16,
											fontWeight: "semibold",
											padding: 20
										}}
									>
										{DateTime.fromISO(
											milestone
										).toLocaleString(
											DateTime.DATETIME_MED_WITH_WEEKDAY
										)}
									</Text>
								))}
						</View>
					</View>
				</View>
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		height: HEADER_HEIGHT,
		position: "absolute",
		resizeMode: "cover",
		width: "100%"
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginBottom: 8
	},
	text: {
		fontSize: 16,
		fontWeight: "semibold",
		color: "white"
	}
});
export default EventDetailScreen;
